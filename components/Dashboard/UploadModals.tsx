import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Dimensions
} from "react-native";

const { width, height } = Dimensions.get("window"); // Get screen dimensions

type UploadModalsProps = {
    showModal: boolean;
    showSecondModal: boolean;
    closeModals: () => void;
    handleCaptureImage: () => void; // Only handling the capture image function directly here
    openSecondModal: () => void;
    handleUploadPDF: () => void; // Added this to be passed from the parent
    handleUploadImage: () => void; // Added this to be passed from the parent
};

const UploadModals: React.FC<UploadModalsProps> = ({
                                                       showModal,
                                                       showSecondModal,
                                                       closeModals,
                                                       handleCaptureImage,
                                                       openSecondModal,
                                                       handleUploadPDF,
                                                       handleUploadImage
                                                   }) => {
    return (
        <>
            {/* First Modal for choosing between Upload from Phone and Scan Report */}
            <Modal visible={showModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.modalClose} onPress={closeModals}>
                            <Text style={styles.modalCloseText}>&times;</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Upload a new Report</Text>
                        <TouchableOpacity style={styles.uploadButton} onPress={openSecondModal}>
                            <Text style={styles.uploadButtonText}>From Phone</Text>
                        </TouchableOpacity>
                        <Text style={styles.orText}>OR</Text>
                        <TouchableOpacity style={styles.uploadButton} onPress={handleCaptureImage}>
                            <Text style={styles.uploadButtonText}>Scan report</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalNote}>*Upload reports in portrait mode only.</Text>
                    </View>
                </View>
            </Modal>

            {/* Second Modal for choosing between Upload PDF and Upload Image */}
            <Modal visible={showSecondModal} transparent={true} animationType="slide">
                <View style={styles.customModalContainer}>
                    <View style={styles.customModalContent}>
                        <Text style={styles.modalTitle}>Select Upload Type</Text>
                        <TouchableOpacity onPress={handleUploadPDF} style={styles.uploadOption}>
                            <Text style={styles.uploadOptionText}>Upload PDF</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleUploadImage}
                            style={[styles.uploadOption, styles.lastUploadOption]}
                        >
                            <Text style={styles.uploadOptionText}>Upload Image</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalClose} onPress={closeModals}>
                            <Text style={styles.modalCloseText}>&times;</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: width * 0.05, // Adjust padding based on screen width
        alignItems: "center",
        width: width * 0.85, // Adjust modal width
    },
    modalClose: {
        position: "absolute",
        top: width * 0.02, // Adjust position based on screen size
        right: width * 0.02, // Adjust position based on screen size
    },
    modalCloseText: {
        fontSize: width * 0.06, // Adjust font size
        fontWeight: "bold",
        color: "black",
    },
    modalTitle: {
        marginTop: height * 0.02, // Adjust margin based on screen size
        fontSize: width * 0.05, // Adjust font size
        fontWeight: "bold",
        marginBottom: height * 0.02, // Adjust margin based on screen size
    },
    uploadButton: {
        backgroundColor: "#0198A5",
        padding: height * 0.02, // Adjust padding based on screen height
        borderRadius: 10,
        alignItems: "center",
        marginBottom: height * 0.015, // Adjust margin based on screen size
        width: "50%", // Make button responsive to modal width
    },
    uploadButtonText: {
        color: "white",
        fontSize: width * 0.045, // Adjust font size
    },
    orText: {
        fontSize: width * 0.04, // Adjust font size
        marginVertical: height * 0.015, // Adjust margin
    },
    modalNote: {
        marginTop: height * 0.01, // Adjust margin
        fontSize: width * 0.035, // Adjust font size
        fontStyle: "italic",
        color: "red",
    },
    customModalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    customModalContent: {
        backgroundColor: "white",
        padding: width * 0.05, // Adjust padding
        borderRadius: 10,
        width: "80%",
    },
    uploadOption: {
        paddingVertical: height * 0.02, // Adjust padding
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    lastUploadOption: {
        borderBottomWidth: 0,
    },
    uploadOptionText: {
        fontSize: width * 0.04, // Adjust font size
        textAlign: "center",
    },
});

export default UploadModals;
