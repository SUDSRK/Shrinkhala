import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { Image } from 'expo-image';
import { WebView } from 'react-native-webview';

type ReportViewerRouteProp = RouteProp<{ params: { url: string } }, 'params'>;

const ReportViewer: React.FC = () => {
    const route = useRoute<ReportViewerRouteProp>();
    const { url } = route.params; // Assuming url is passed as a route parameter
    const fileType = url.split('.').pop()?.toLowerCase(); // Get the file type
    const navigation = useNavigation();

    // Log the URL and file type for debugging
    console.log('URL:', url);
    console.log('File Type:', fileType);

    // Render PDF or image based on the file type
    const renderFile = () => {
        if (fileType === 'pdf') {
            return (
                <WebView
                    source={{ uri: url }}
                    style={styles.webview}
                    startInLoadingState={true}
                    javaScriptEnabled={true}
                />
            );
        } else {
            return <Image source={{ uri: url }} style={styles.image} />;
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                {renderFile()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
    },
    backButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    backButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        resizeMode: 'contain',
    },
    webview: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});

export default ReportViewer;
