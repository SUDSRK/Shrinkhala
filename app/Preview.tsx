import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width; // Get screen width for dynamic sizing

type RouteParams = {
    Preview: {
        file: {
            uri: string;
            type: string;
            name: string;
        };
        userName: string;
    };
};

interface UploadState {
    isLoading: boolean;
}

const Preview = () => {
    const route = useRoute<RouteProp<RouteParams, 'Preview'>>();
    const navigation = useNavigation();
    const { file, userName } = route.params;
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

    const handleUpload = async () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('user_name', userName);
        formData.append('file', {
            uri: file.uri,
            type: file.type,
            name: file.name,
        });

        try {
            const response = await fetch("https://extract.shrinkhala.in/extract", {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.ok) {
                if (soundRef.current) {
                    await soundRef.current.replayAsync();
                }
                setIsLoading(false);
                Alert.alert('Success', 'File uploaded successfully',[
                    { text: 'OK', onPress: () => router.push('/Dashboard') }
                ]);
            } else {
                const responseText = await response.text();
                console.error('Upload failed with response:', responseText);
                setIsLoading(false);
                Alert.alert('Upload Error', `Upload failed: Please try after some time.`, [
                    { text: 'OK', onPress: () => router.push('/Dashboard') }
                ]);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setIsLoading(false);
            Alert.alert('Upload Error', `There was an issue uploading the file: Please try after some time.`,[
                { text: 'OK', onPress: () => router.push('/Dashboard') }
                ]);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Selected File</Text>
            <View style={styles.fileContainer}>
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
            <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                <Text style={styles.uploadButtonText}>Upload File</Text>
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
        marginBottom: 20
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
