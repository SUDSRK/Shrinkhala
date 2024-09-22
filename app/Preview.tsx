import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    Dimensions,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';

const screenWidth = Dimensions.get('window').width; // Get screen width for dynamic sizing

type RouteParams = {
    Preview: {
        files: {
            uri: string;
            type: string;
            name: string;
        }[];
        userName: string;
    };
};

const Preview = () => {
    const route = useRoute<RouteProp<RouteParams, 'Preview'>>();
    const navigation = useNavigation();
    const { files, userName } = route.params;
    const soundRef = useRef<Audio.Sound | null>(null);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Load the sound file
    useEffect(() => {
        const loadSound = async () => {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/success.mp3') // Path to your sound file
            );
            soundRef.current = sound;
        };

        loadSound();

        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    const validateFileUri = async (uri: string) => {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        return fileInfo.exists && fileInfo;
    };

    const handleUpload = async () => {
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('user_name', userName);

            for (const file of files) {
                const isValidUri = await validateFileUri(file.uri);
                if (!isValidUri) {
                    Alert.alert('File Error', `File at ${file.uri} does not exist or is not accessible.`);
                    setIsLoading(false);
                    return;
                }

                formData.append('file', {
                    uri: file.uri,
                    type: file.type || 'image/jpeg',
                    name: file.name || 'upload.jpg',
                });
            }

            const response = await fetch('https://extract.shrinkhala.in/extract', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.ok) {
                const responseText = await response.text();
                console.error('Upload failed with response:', responseText);
                Alert.alert('Upload Error', `Upload failed: ${responseText || 'Please try again later.'}`, [
                    { text: 'OK', onPress: () => router.push('/Dashboard') },
                ]);
                setIsLoading(false);
                return;
            }

            // Play success sound
            if (soundRef.current) {
                await soundRef.current.replayAsync();
            }

            Alert.alert('Success', 'Files uploaded successfully', [
                { text: 'OK', onPress: () => router.push('/Dashboard') },
            ]);
        } catch (error) {
            console.error('Error uploading files:', error);
            Alert.alert('Upload Error', `There was an issue uploading the files. Please try again later.`, [
                { text: 'OK', onPress: () => router.push('/Dashboard') },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Selected Files</Text>
            <Text style={styles.infoText}>Note: In case of multiple file selection, ensure that they are of the same report.</Text>
            <ScrollView contentContainerStyle={styles.filesContainer}>
                {files.map((file, index) => (
                    <View key={index} style={styles.fileContainer}>
                        {file.type === 'application/pdf' ? (
                            <TouchableOpacity
                                style={styles.previewButton}
                                onPress={() => navigation.navigate('PreviewPDF', { uri: file.uri })}
                            >
                                <MaterialIcons name="picture-as-pdf" size={100} color="red" />
                                <Text>PDF File</Text>
                            </TouchableOpacity>
                        ) : (
                            <Image source={{ uri: file.uri }} style={styles.image} resizeMode="contain" />
                        )}
                    </View>
                ))}
            </ScrollView>
            <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                <Text style={styles.uploadButtonText}>Upload Files</Text>
            </TouchableOpacity>
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text style={styles.loadingText}>Uploading...</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10
    },
    infoText: {
        fontSize: 14,
        color: 'red',
        marginBottom: 20,
        textAlign: 'center'
    },
    filesContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    fileContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        width: screenWidth * 0.9,
        height: screenWidth * 0.9,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    previewButton: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    uploadButton: {
        backgroundColor: '#0198A5',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        width: screenWidth * 0.9,
    },
    uploadButtonText: {
        color: 'white',
        fontSize: 16
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1
    },
    loadingText: {
        color: 'white',
        marginTop: 10,
        fontSize: 16
    }
});

export default Preview;
