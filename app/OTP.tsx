import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';

const OTP = () => {
    const router = useRouter();
    const route = useRoute();
    const { phoneNumber } = route.params as { phoneNumber: string };

    const [otp, setOtp] = useState<string[]>(['', '', '', '']);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [incorrectOtp, setIncorrectOtp] = useState<string>("");
    const inputs = useRef<(TextInput | null)[]>([]);

    useEffect(() => {
        setIncorrectOtp("");
    }, []);

    const handleChange = (index: number, value: string) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, event: { nativeEvent: { key: string } }) => {
        if (event.nativeEvent.key === 'Backspace' && index > 0 && !otp[index]) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        const otpString = otp.join('');

        if (otpString === "7044") {
            setIsSubmitting(false);
            router.push({ pathname: '/Registration', params: { phoneNumber } });
        } else {
            setIsSubmitting(false);
            setIncorrectOtp("Incorrect OTP");
        }
    };

    return (
        <View style={styles.container}>
            {/*<Link href="/signup" asChild>*/}
            {/*    <TouchableOpacity>*/}
            {/*        <Image source={back} style={styles.backIcon} />*/}
            {/*    </TouchableOpacity>*/}
            {/*</Link>*/}

            <Text style={styles.header}>Shrinkhala</Text>
            <Text style={styles.title}>Enter OTP</Text>

            <View style={styles.otpContainer}>
                {otp.map((value, index) => (
                    <TextInput
                        key={index}
                        style={styles.otpInput}
                        maxLength={1}
                        value={value}
                        onChangeText={(text) => handleChange(index, text)}
                        onKeyPress={(e) => handleKeyDown(index, e)}
                        ref={(input) => (inputs.current[index] = input)}
                        keyboardType="numeric"
                    />
                ))}
            </View>

            {incorrectOtp ? <Text style={styles.errorMsg}>{incorrectOtp}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
                <Text style={styles.buttonText}>{isSubmitting ? 'Continuing...' : 'Continue'}</Text>
            </TouchableOpacity>

            <Text style={styles.resendText}>Resend OTP in 30 seconds</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    backIcon: {
        width: 24,
        height: 24,
        alignSelf: 'flex-start',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0198A5',
        marginVertical: 20,
    },
    title: {
        fontSize: 18,
        marginBottom: 20,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    otpInput: {
        width: 55,
        height: 55,
        marginRight: 15,
        textAlign: 'center',
        fontSize: 23,
        borderWidth: 1,
        borderColor: '#ecdede',
    },
    errorMsg: {
        color: 'red',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#0198A5',
        padding: 15,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
        marginVertical: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    resendText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#0198A5',
    },
});

export default OTP;
