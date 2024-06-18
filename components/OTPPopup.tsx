import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextStyle } from 'react-native';

interface OtpPopupProps {
    userName: string;
    otp: string;
    onClose: () => void;
}

const OtpPopup: React.FC<OtpPopupProps> = ({ userName, otp, onClose }) => {
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.popup}>
                    <Text style={styles.title}>Show these below details to your respective Doctor/Hospital</Text>
                    <View style={styles.detailContainer}>
                        <Text style={styles.detailText}>OTP: <Text style={styles.detailValue}>{otp}</Text></Text>
                    </View>
                    <View style={styles.detailContainer}>
                        <Text style={styles.detailText}>USERNAME: <Text style={styles.detailValue}>{userName}</Text></Text>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>Okay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popup: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 16,
    },
    detailContainer: {
        padding: 16,
        backgroundColor: 'gainsboro',
        borderRadius: 16,
        marginVertical: 8,
        width: '100%',
    },
    detailText: {
        fontSize: 16,
        fontWeight: '400',
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '700',
    },
    button: {
        backgroundColor: '#0198A5',
        padding: 16,
        borderRadius: 16,
        marginTop: 16,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default OtpPopup;
