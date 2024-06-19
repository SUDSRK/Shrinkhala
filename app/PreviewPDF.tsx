import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Alert, Linking } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

type RouteParams = {
    PreviewPDF: {
        uri: string;
        userName: string;
    };
};

const PreviewPDF: React.FC = () => {
    const route = useRoute<RouteProp<RouteParams, 'PreviewPDF'>>();
    const { uri, userName } = route.params;
    const [fileUri, setFileUri] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
        console.log('URI in PreviewPDF:', uri);
        if (!uri) {
            setError('Invalid file URI');
            return;
        }

        setFileUri(uri);
    }, [uri]);

    const openWithOtherApps = () => {
        if (fileUri) {
            Linking.openURL(fileUri);
        }
    };

    const downloadPDF = async () => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Permission to access media library is required!');
                return;
            }

            const fileName = fileUri!.split('/').pop();
            const destinationUri = FileSystem.documentDirectory + fileName;

            await FileSystem.copyAsync({
                from: fileUri!,
                to: destinationUri,
            });

            const asset = await MediaLibrary.createAssetAsync(destinationUri);
            const album = await MediaLibrary.getAlbumAsync('Download');
            if (album == null) {
                await MediaLibrary.createAlbumAsync('Download', asset, false);
            } else {
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            }

            Alert.alert('Download Complete', 'PDF has been downloaded and saved to your device.');
        } catch (error) {
            console.error('Error downloading file:', error);
            Alert.alert('Download Error', 'There was an issue downloading the file.');
        }
    };

    const handleUpload = async () => {
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
                    Alert.alert('Success', 'PDF uploaded successfully');
                    navigation.navigate('Dashboard'); // Navigate back to dashboard after upload
                } else {
                    const responseText = await response.text();
                    console.error('Upload failed with response:', responseText);
                    Alert.alert('Upload Error', `Upload failed: ${responseText}`);
                }
            } else {
                Alert.alert('File Error', `File at ${fileUri} does not exist.`);
                return;
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            Alert.alert('Upload Error', `There was an issue uploading the file: ${error.message}`);
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
            <Text style={styles.infoText}>PDF Viewer is in progress,But still you can upload PDF</Text>
            {/*<TouchableOpacity style={styles.button} onPress={openWithOtherApps}>*/}
            {/*    <Text style={styles.buttonText}>Open with Other Apps</Text>*/}
            {/*</TouchableOpacity>*/}
            {/*<TouchableOpacity style={styles.button} onPress={downloadPDF}>*/}
            {/*    <Text style={styles.buttonText}>Download PDF</Text>*/}
            {/*</TouchableOpacity>*/}
            <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                <Text style={styles.buttonText}>Upload PDF</Text>
            </TouchableOpacity>
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
