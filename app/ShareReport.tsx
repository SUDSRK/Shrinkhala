import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Alert, Button, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OtpPopup from "@/components/OTPPopup";

interface Doctor {
    id: string;
    name: string;
}

interface QRData {
    doctor_id: string;
    full_name: string;
    name_of_hospital: string;
}

const { width, height } = Dimensions.get("window");

const ShareReport = () => {
    const [userName, setUserName] = useState<string>('');
    const navigation = useNavigation();
    const [showOtpPopup, setShowOtpPopup] = useState<boolean>(false);
    const [otp, setOtp] = useState<string>('');
    const [showScannerModal, setShowScannerModal] = useState<boolean>(false);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [qrData, setQrData] = useState<QRData>({ doctor_id: "", full_name: "", name_of_hospital: "" });
    const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const [scanned, setScanned] = useState<boolean>(false);
    const [permission, requestPermission] = useCameraPermissions();

    useEffect(() => {
        (async () => {
            try {
                const username = await AsyncStorage.getItem('userName');
                if (username) {
                    setUserName(username);
                } else {
                    console.error("No user name found in AsyncStorage.");
                }
            } catch (error) {
                console.error('Failed to fetch username from AsyncStorage', error);
            }
        })();
    }, []);

    useEffect(() => {
        if (permission) {
            setHasPermission(permission.granted);
        }
    }, [permission]);

    useEffect(() => {
        if (userName) {
            fetchDoctorsList();
        }
    }, [userName]);

    const fetchDoctorsList = async () => {
        try {
            const response = await fetch(`https://api.shrinkhala.in/patient/${userName}/doctors`);
            if (response.ok) {
                const data = await response.json();
                const transformedData = data.map((doctor: any) => ({
                    id: doctor.user_id,
                    name: `${doctor.first_name} ${doctor.last_name}`
                }));
                setDoctorsList(transformedData);
            } else {
                console.error('Error fetching doctors data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching doctors data:', error);
            Alert.alert("Error", "Unable to fetch doctors list. Please try again later.");
        }
    };

    const handleRemoveDoctor = async (doctorId: string) => {
        try {
            const response = await fetch(`https://api.shrinkhala.in/patient/${userName}/doctors/${doctorId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                const updatedDoctorsList = doctorsList.filter(doctor => doctor.id !== doctorId);
                setDoctorsList(updatedDoctorsList);
                Alert.alert("Success", "Doctor removed successfully.");
            } else {
                console.error('Error removing doctor:', response.statusText);
                Alert.alert("Error", "Unable to remove doctor. Please try again.");
            }
        } catch (error) {
            console.error('Error removing doctor:', error);
            Alert.alert("Error", "An error occurred while removing the doctor. Please try again.");
        }
    };

    const handleGenerateOTP = async () => {
        try {
            const response = await fetch('https://api.shrinkhala.in/patient/generate_otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userName }),
            });
            if (response.ok) {
                const data = await response.json();
                setOtp(data.otp);
                setShowOtpPopup(true);
            } else {
                console.error('Error generating OTP:', response.statusText);
                Alert.alert("Error", "Unable to generate OTP. Please try again.");
            }
        } catch (error) {
            console.error('Error generating OTP:', error);
            Alert.alert("Error", "An error occurred while generating OTP. Please try again.");
        }
    };

    const handleScan = ({ data }: { data: string }) => {
        setScanned(true);
        try {
            const scannedText = JSON.parse(data);
            handleLinkDoctor(scannedText);
        } catch (error) {
            console.error('Invalid QR data format:', error);
            Alert.alert("Error", "Invalid QR data format.");
            setScanned(false);
        }
    };

    const handleLinkDoctor = async (scannedData: QRData) => {
        try {
            const response = await fetch('https://api.shrinkhala.in/doctor/patient', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ doctor_id: scannedData.doctor_id, patient_id: userName }),
            });

            if (response.ok) {
                setQrData(scannedData);
                setShowScannerModal(false);
                setShowSuccessModal(true);
            } else {
                console.error('Error linking doctor:', response.statusText);
                Alert.alert("Error", "Unable to link doctor. Please try again.");
            }
        } catch (error) {
            console.error('Error linking doctor:', error);
            Alert.alert("Error", "An error occurred while linking the doctor. Please try again.");
        }
    };

    const requestCameraPermission = async () => {
        try {
            const { granted } = await requestPermission();
            if (!granted) {
                Alert.alert("Permission Denied", "Camera permission is required to scan QR codes.");
            }
        } catch (error) {
            console.error("Error requesting camera permission:", error);
            Alert.alert("Error", "Unable to request camera permission.");
        }
    };

    const closeScannerModal = () => {
        setShowScannerModal(false);
        setScanned(false);
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
    };

    useEffect(() => {
        if (permission === null) {
            requestCameraPermission();
        }
    }, [permission]);

    if (permission === null || !hasPermission) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>We need your permission to show the camera</Text>
                <Button onPress={requestCameraPermission} title="Grant Permission" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Share your Reports</Text>
                <Text style={styles.subtitle}>All your Reports will be shared with the doctor</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleGenerateOTP}>
                        <MaterialIcons name="lock" size={width * 0.06} color="#0198A5" />
                        <Text style={styles.buttonText}>Via OTP</Text>
                    </TouchableOpacity>
                    <Text style={styles.orText}>OR</Text>
                    <TouchableOpacity style={styles.button} onPress={() => setShowScannerModal(true)}>
                        <MaterialIcons name="qr-code-scanner" size={width * 0.06} color="#0198A5" />
                        <Text style={styles.buttonText}>Via QR Scanner</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.divider} />
                <View style={styles.doctorsList}>
                    <Text style={styles.doctorsListTitle}>Shared with</Text>
                    <Text style={styles.doctorsListSubtitle}>Doctors you have shared all your reports</Text>
                    {doctorsList.map((doctor, index) => (
                        <View key={index} style={styles.doctorItem}>
                            <Text style={styles.doctorName}>{doctor.name}</Text>
                            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveDoctor(doctor.id)}>
                                <Text style={styles.removeButtonText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <Modal visible={showScannerModal} transparent={true} animationType="slide" onRequestClose={closeScannerModal}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <CameraView
                            onBarcodeScanned={scanned ? undefined : handleScan}
                            style={styles.camera}
                            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={closeScannerModal}>
                            <MaterialIcons name="close" size={width * 0.06} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal visible={showSuccessModal} transparent={true} animationType="slide" onRequestClose={closeSuccessModal}>
                <View style={styles.modalBackground}>
                    <View style={styles.successModalContent}>
                        <Text style={styles.successTitle}>Shared Successfully!</Text>
                        <Text style={styles.successMessage}>
                            Your account has been Successfully Connected with <Text style={styles.highlight}>{qrData.full_name}</Text> at <Text style={styles.highlight}>{qrData.name_of_hospital}</Text>
                        </Text>
                        <TouchableOpacity style={styles.okButton} onPress={closeSuccessModal}>
                            <Text style={styles.okButtonText}>Okay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {showOtpPopup && <OtpPopup userName={userName} otp={otp} onClose={() => setShowOtpPopup(false)} />}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollContainer: {
        padding: width * 0.04,
    },
    title: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        marginBottom: height * 0.01,
    },
    subtitle: {
        fontSize: width * 0.04,
        color: 'gray',
        marginBottom: height * 0.02,
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: height * 0.04,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e6f6f6',
        padding: height * 0.02,
        borderRadius: 8,
        marginVertical: height * 0.01,
        width: '80%',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#0198A5',
        fontSize: width * 0.04,
        marginLeft: width * 0.02,
    },
    orText: {
        fontSize: width * 0.04,
        color: 'gray',
        marginVertical: height * 0.01,
    },
    doctorsList: {
        marginTop: height * 0.03,
    },
    doctorsListTitle: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        marginBottom: height * 0.01,
    },
    doctorsListSubtitle: {
        fontSize: width * 0.04,
        color: 'gray',
        marginBottom: height * 0.02,
    },
    doctorItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: height * 0.01,
    },
    doctorName: {
        fontSize: width * 0.04,
    },
    removeButton: {
        padding: height * 0.01,
        backgroundColor: 'lightpink',
        borderRadius: 4,
    },
    removeButtonText: {
        color: '#F1416C',
        fontSize: width * 0.035,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width * 0.8,
        height: height * 0.5,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    closeButton: {
        position: 'absolute',
        top: height * 0.02,
        right: width * 0.04,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 16,
        padding: width * 0.02,
    },
    successModalContent: {
        width: width * 0.8,
        padding: width * 0.04,
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
    },
    successTitle: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        marginBottom: height * 0.02,
    },
    successMessage: {
        fontSize: width * 0.04,
        textAlign: 'center',
        marginBottom: height * 0.02,
    },
    highlight: {
        fontWeight: 'bold',
    },
    okButton: {
        backgroundColor: '#0198A5',
        padding: height * 0.02,
        borderRadius: 8,
    },
    okButtonText: {
        color: 'white',
        fontSize: width * 0.04,
    },
    divider: {
        borderBottomColor: 'grey',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    camera: {
        flex: 1,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: width * 0.05,
        backgroundColor: "white",
    },
    permissionText: {
        fontSize: width * 0.05,
        color: "grey",
        textAlign: "center",
        marginBottom: height * 0.02,
    }
});

export default ShareReport;
