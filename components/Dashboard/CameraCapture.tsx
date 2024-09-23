import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Text, Modal, StyleSheet, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera"; // Import CameraView and useCameraPermissions
import { useNavigation } from "@react-navigation/native";

type CameraCaptureProps = {
    cameraVisible: boolean;
    closeCamera: () => void;
    userName: string;
};

const CameraCapture: React.FC<CameraCaptureProps> = ({
                                                         cameraVisible,
                                                         closeCamera,
                                                         userName,
                                                     }) => {
    const cameraRef = useRef(null);
    const [cameraType, setCameraType] = useState<'back' | 'front'>('back'); // Initialize camera type with 'back'
    const navigation = useNavigation();
    const [permission, requestPermission] = useCameraPermissions(); // Use useCameraPermissions hook

    useEffect(() => {
        // Request camera permissions if not already granted
        if (!permission || !permission.granted) {
            requestPermission();
        }
    }, [permission]);

    const handleTakePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            console.log(photo);
            closeCamera();
            navigation.navigate("PreviewCamera", { file: photo, userName });
        }
    };

    const toggleCameraType = () => {
        setCameraType((prevType) => (prevType === 'back' ? 'front' : 'back'));
    };

    // Show an alert if permission is not granted
    if (permission && !permission.granted) {
        Alert.alert("Camera Permission Required", "Please grant camera permissions to use this feature.");
        return null;
    }

    return (
        <Modal visible={cameraVisible} transparent={true}>
            <View style={{ flex: 1, backgroundColor: "black" }}>
                {permission && permission.granted && (
                    <CameraView style={{ flex: 1 }} facing={cameraType} ref={cameraRef}>
                        <View style={styles.cameraContainer}>
                            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraType}>
                                <Text style={styles.flipText}>Flip</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.captureButton} onPress={handleTakePicture}>
                                <Text style={styles.captureText}>Capture</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.backButton} onPress={closeCamera}>
                                <Text style={styles.backText}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </CameraView>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        backgroundColor: "transparent",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        padding: 20,
    },
    captureButton: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 5,
    },
    captureText: {
        fontSize: 16,
        color: "black",
    },
    flipButton: {
        position: "absolute",
        top: 20,
        left: 20,
    },
    flipText: {
        fontSize: 18,
        color: "white",
    },
    backButton: {
        position: "absolute",
        top: 20,
        right: 20,
    },
    backText: {
        fontSize: 18,
        color: "white",
    },
});

export default CameraCapture;
