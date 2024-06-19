import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const screenWidth = Dimensions.get('window').width; // Get screen width for dynamic sizing

type RouteParams = {
    PreviewCamera: {
        file: {
            uri: string;
            height: number;
            width: number;
        };
        userName: string;
    };
};

const PreviewCamera = () => {
    const route = useRoute<RouteProp<RouteParams, 'PreviewCamera'>>();
    const navigation = useNavigation();
    const { file, userName } = route.params;
    const soundRef = useRef<Audio.Sound | null>(null);

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
        const formData = new FormData();
        formData.append('user_name', userName);
        formData.append('file', {
            uri: file.uri,
            type: 'image/jpeg',
            name: file.uri.split('/').pop()
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
                Alert.alert('Success', 'File uploaded successfully');
                navigation.navigate('Dashboard'); // Navigate back to dashboard after upload
            } else {
                const responseText = await response.text();
                console.error('Upload failed with response:', responseText);
                Alert.alert('Upload Error', `Upload failed: ${responseText}`);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            Alert.alert('Upload Error', `There was an issue uploading the file: ${error.message}`);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Preview Captured Image</Text>
            <View style={styles.fileContainer}>
                <Image source={{ uri: file.uri }} style={styles.image} resizeMode="contain" />
                <Text>Dimensions: {file.width} x {file.height}</Text>
            </View>
            <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                <Text style={styles.uploadButtonText}>Upload File</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    fileContainer: {
        alignItems: 'center',
        marginBottom: 20, // Increase space between items
        flexDirection: 'column', // Ensure items are arranged in a column
        backgroundColor: '#f9f9f9', // Add background color for better visibility
        padding: 10, // Add padding around each item
        borderRadius: 10, // Add border radius for rounded corners
        borderWidth: 1, // Add border
        borderColor: '#ddd', // Border color
        width: screenWidth * 0.8, // Use 80% of the screen width for the container
    },
    image: {
        width: '100%', // Make the image take full width of the container
        aspectRatio: 1, // Maintain the aspect ratio (square for initial setup)
        borderRadius: 10, // Optional: Add border radius to images
    },
    previewButton: { alignItems: 'center', justifyContent: 'center' },
    uploadButton: {
        backgroundColor: '#0198A5',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    uploadButtonText: { color: 'white', fontSize: 16 },
});

export default PreviewCamera;
