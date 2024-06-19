import React, { useState, useEffect } from "react";
import {View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Alert, Button} from "react-native";
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
        if (permission) {
            setHasPermission(permission.granted);
        }
    }, [permission]);

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const username = await AsyncStorage.getItem('userName');
                if (username) {
                    setUserName(username);
                }
                console.log("Fetched username:", username);
            } catch (error) {
                console.error('Failed to fetch username from AsyncStorage', error);
            }
        };

        fetchUserName();
    }, []);


    const handleScannerOpen = () => {
        setShowScannerModal(true);
    };

    const closeScannerModal = () => {
        setShowScannerModal(false);
        setScanned(false);
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
    };

    useEffect(() => {
        if (userName) {
            fetch(`https://api.shrinkhala.in/patient/${userName}/doctors`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(data => {
                    const transformedData = data.map((doctor: any) => ({
                        id: doctor.user_id,
                        name: `${doctor.first_name} ${doctor.last_name}`
                    }));
                    setDoctorsList(transformedData);
                })
                .catch(error => {
                    console.error('Error fetching doctors data:', error);
                });
        }
    }, [userName]);

    const handleRemoveDoctor = (doctorId: string) => {
        fetch(`https://api.shrinkhala.in/patient/${userName}/doctors/${doctorId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
                const updatedDoctorsList = doctorsList.filter(doctor => doctor.id !== doctorId);
                setDoctorsList(updatedDoctorsList);
            })
            .catch(error => {
                console.error('Error removing doctor:', error);
            });
    };

    const handleScan = ({ data }: { data: string }) => {
        setScanned(true);
        if (data) {
            const scannedText = JSON.parse(data);

            fetch('https://api.shrinkhala.in/doctor/patient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    doctor_id: scannedText.doctor_id,
                    patient_id: userName
                })
            })
                .then(response => response.json())
                .then(responseData => {
                    setQrData({
                        ...scannedText,
                        doctor_id: scannedText.doctor_id,
                        name_of_hospital: scannedText.name_of_hospital,
                        full_name: scannedText.full_name
                    });
                    setShowScannerModal(false);
                    setShowSuccessModal(true);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    };

    const handleGenerateOTP = () => {
        fetch('https://api.shrinkhala.in/patient/generate_otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userName
            })
        })
            .then(response => response.json())
            .then(data => {
                const otp = data.otp;
                setOtp(otp);
                setShowOtpPopup(true)
            })
            .catch(error => {
                console.error('Error generating OTP:', error);
            });
    };

    if (permission === null) {
        return <View />;
    }
    if (!hasPermission) {
        <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
    </View>
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Share your Reports</Text>
                <Text style={styles.subtitle}>All your Reports will be shared with the doctor</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleGenerateOTP}>
                        <MaterialIcons name="lock" size={24} color="#0198A5" />
                        <Text style={styles.buttonText}>Via OTP</Text>
                    </TouchableOpacity>
                    <Text style={styles.orText}>OR</Text>
                    <TouchableOpacity style={styles.button} onPress={handleScannerOpen}>
                        <MaterialIcons name="qr-code-scanner" size={24} color="#0198A5" />
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
            <Modal
                visible={showScannerModal}
                transparent={true}
                animationType="slide"
                onRequestClose={closeScannerModal}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <CameraView
                            onBarcodeScanned={scanned ? undefined : handleScan}
                            barcodeScannerSettings={{
                                barcodeTypes: ["qr"],
                            }}
                            style={styles.camera}
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={closeScannerModal}>
                            <MaterialIcons name="close" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={showSuccessModal}
                transparent={true}
                animationType="slide"
                onRequestClose={closeSuccessModal}
            >
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
            {showOtpPopup && (
                <OtpPopup userName={userName} otp={otp} onClose={() => setShowOtpPopup(false)} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 16,
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e6f6f6',
        padding: 16,
        borderRadius: 8,
        marginVertical: 8,
        width: '80%',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#0198A5',
        fontSize: 16,
        marginLeft: 8,
    },
    orText: {
        fontSize: 16,
        color: 'gray',
        marginVertical: 8,
    },
    doctorsList: {
        marginTop: 32,
    },
    doctorsListTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    doctorsListSubtitle: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 16,
    },
    doctorItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    doctorName: {
        fontSize: 16,
    },
    removeButton: {
        padding: 8,
        backgroundColor: 'lightpink',
        borderRadius: 4,
    },
    removeButtonText: {
        color: '#F1416C',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        height: '50%',
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 16,
        padding: 8,
    },
    successModalContent: {
        width: '80%',
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
    },
    successTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    successMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    highlight: {
        fontWeight: 'bold',
    },
    okButton: {
        backgroundColor: '#0198A5',
        padding: 16,
        borderRadius: 8,
    },
    okButtonText: {
        color: 'white',
        fontSize: 16,
    },
    divider: {
        borderBottomColor: 'grey',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    camera: {
        flex: 1,
    },
});

export default ShareReport;
