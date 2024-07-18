import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Image as ExpoImage } from 'expo-image';
import { WebView } from 'react-native-webview';

type ReportViewerRouteProp = RouteProp<{ params: { url: string } }, 'params'>;

const ReportViewer: React.FC = () => {
    const route = useRoute<ReportViewerRouteProp>();
    const { url } = route.params;
    const fileType = url.split('.').pop()?.toLowerCase();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);

    // Log the URL and file type for debugging
    console.log('URL:', url);
    console.log('File Type:', fileType);

    useEffect(() => {
        if (fileType === 'pdf') {
            setTimeout(() => {
                navigation.navigate('Dashboard');
            }, 2000);
        }
    }, [fileType, navigation]);

    // Render PDF or image based on the file type
    const renderFile = () => {
        if (fileType === 'pdf') {
            return (
                <WebView
                    source={{ uri: url }}
                    style={styles.webview}
                    startInLoadingState={true}
                    javaScriptEnabled={true}
                    onLoadEnd={() => setLoading(false)}
                />
            );
        } else {
            return (
                <ExpoImage
                    source={{ uri: url }}
                    style={styles.image}
                    contentFit="contain"
                    onLoadEnd={() => setLoading(false)}
                    onError={(error) => {
                        console.log('Error loading image:', error);
                        setLoading(false);
                    }}
                />
            );
        }
    };

    return (
        <View style={styles.container}>
            {loading && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
            <View style={[styles.content, loading && styles.hidden]}>
                {renderFile()}
                {fileType !== 'pdf' && (
                    <Text style={styles.errorText}>
                        If you can't see the image, please check the URL or your network connection.
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hidden: {
        opacity: 0,
    },
    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent background
    },
    image: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    webview: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    errorText: {
        marginTop: 20,
        color: 'red',
        textAlign: 'center',
    },
});

export default ReportViewer;
