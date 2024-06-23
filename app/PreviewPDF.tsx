import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Alert, Linking } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';

const PreviewPDF: React.FC = () => {
    const { uri, userName } = useLocalSearchParams() as { uri: string; userName: string };
    const [fileUri, setFileUri] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const router = useRouter();

    useEffect(() => {
        console.log('URI in PreviewPDF:', uri);
        if (!uri) {
            setError('Invalid file URI');
            return;
        }

        setFileUri(uri);
    }, [uri]);

    useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const playSound = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/success.mp3')        );
        setSound(sound);
        await sound.playAsync();
    };

    const handleUpload = async () => {
        setLoading(true);
        try {
            const fileInfo = await FileSystem.getInfoAsync(fileUri!);
            if (fileInfo.exists) {
                const formData = new FormData();
                formData.append('user_name', userName);
                formData.append('file', {
                    uri: fileUri,
                    type: 'application/pdf',
                    name: fileUri!.split('/').pop()!,
                });

                const response = await fetch("https://extract.shrinkhala.in/extract", {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.ok) {
                    await playSound();
                    Alert.alert('Success', 'PDF uploaded successfully', [
                        { text: 'OK', onPress: () => router.push('/Dashboard') }
                    ]);
                } else {
                    const responseText = await response.text();
                    console.error('Upload failed with response:', responseText);
                    Alert.alert('Upload Error', `Upload failed, Please try after some time`, [
                        { text: 'OK', onPress: () => router.push('/Dashboard') }
                    ]);
                }
            } else {
                Alert.alert('File Error', `File at ${fileUri} does not exist.`);
                return;
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            Alert.alert('Upload Error', `There was an issue uploading the file, Please try after sometime.`, [
                { text: 'OK', onPress: () => router.push('/Dashboard') }
            ]);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!fileUri) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.infoText}>PDF Viewer is in progress, but you can still upload PDF</Text>
            {/*<TouchableOpacity style={styles.button} onPress={openWithOtherApps}>*/}
            {/*    <Text style={styles.buttonText}>Open with Other Apps</Text>*/}
            {/*</TouchableOpacity>*/}
            {/*<TouchableOpacity style={styles.button} onPress={downloadPDF}>*/}
            {/*    <Text style={styles.buttonText}>Download PDF</Text>*/}
            {/*</TouchableOpacity>*/}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                    <Text style={styles.buttonText}>Upload PDF</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: 'red' },
    infoText: { marginTop: 20, fontSize: 16, textAlign: 'center' },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        margin: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    uploadButton: {
        backgroundColor: '#0198A5',
        padding: 10,
        borderRadius: 5,
        margin: 20,
    },
});

export default PreviewPDF;
