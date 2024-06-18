import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    Alert,
    Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width; // Get screen width for dynamic sizing

type RouteParams = {
    Preview: {
        selectedFiles: Array<{
            uri: string;
            type: string;
        }>;
        userName: string;
    };
};

const Preview = () => {
    const route = useRoute<RouteProp<RouteParams, 'Preview'>>();
    const navigation = useNavigation();
    const { selectedFiles, userName } = route.params;

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('user_name', userName);

        try {
            for (const [index, file] of selectedFiles.entries()) {
                const response = await fetch(file.uri);
                const blob = await response.blob();
                const fileName = file.uri.split('/').pop() || `file${index}`;
                const fileBlob = new Blob([blob], { type: file.type || 'image/jpeg' });

                formData.append('file', fileBlob, fileName);
            }

            const response = await fetch("http://34.16.227.186:5000/extract", {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                Alert.alert('Success', 'Files uploaded successfully');
                navigation.navigate('dashboard'); // Navigate back to dashboard after upload
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error("Error uploading files:", error);
            Alert.alert('Upload Error', 'There was an issue uploading the files.');
        }
    };

    const renderItem = ({ item }: { item: { uri: string; type: string } }) => {
        return (
            <View style={styles.fileContainer}>
                {item.type === 'application/pdf' ? (
                    <TouchableOpacity
                        style={styles.previewButton}
                        onPress={() => navigation.navigate('PreviewPDF', { uri: item.uri })}
                    >
                        <MaterialIcons name="picture-as-pdf" size={100} color="red" />
                        <Text>PDF File</Text>
                    </TouchableOpacity>
                ) : (
                    <Image source={{ uri: item.uri }} style={styles.image} resizeMode="contain" />
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Preview Selected Files</Text>
            <FlatList
                data={selectedFiles}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.flatListContent} // Align items in a column
            />
            <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                <Text style={styles.uploadButtonText}>Upload Files</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    flatListContent: {
        flexDirection: 'column',
        alignItems: 'center', // Center items horizontally
    },
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
    removeButton: { marginTop: 10 }, // Adjust position
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

export default Preview;
