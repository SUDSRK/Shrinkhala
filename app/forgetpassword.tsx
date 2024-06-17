import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';

const ForgetPassword: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [numberErrorMsg, setNumberErrorMsg] = useState('');
    const [numberError, setNumberError] = useState(false);

    const router = useRouter();

    const numberValidator = (value: string) => {
        setInputValue(value);
        setIsValid(!isNaN(Number(value)));
    };

    const numberSubmit = () => {
        console.log('inputValue-', inputValue);
        if (inputValue.length === 10) {
            setNumberError(false);
            router.push({ pathname: '/otpscreen', params: { mobileNumber: inputValue } });
        } else {
            setNumberError(true);
            setNumberErrorMsg('Please enter a 10 digit phone number.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/*<Link href="/" asChild>*/}
                {/*    <TouchableOpacity>*/}
                {/*        <Image source={require('../assets/images/back.svg')} style={styles.backButton} />*/}
                {/*    </TouchableOpacity>*/}
                {/*</Link>*/}
                <Text style={styles.title}>Forgot Password</Text>
            </View>
            <Image source={require('../assets/images/forgetPassword.png')} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.infoText}>Please enter your Mobile Number to verify your account</Text>
            </View>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>Mobile Number</Text>
            </View>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                maxLength={10}
                value={inputValue}
                placeholder="Enter Mobile Number"
                onChangeText={numberValidator}
            />
            {!isValid && <Text style={styles.errorText}>Please enter a valid number</Text>}
            {numberError && <Text style={styles.errorText}>{numberErrorMsg}</Text>}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={numberSubmit}>
                    <Text style={styles.buttonText}>Save Password</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    image: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginVertical: 20,
    },
    textContainer: {
        marginTop: 20,
    },
    infoText: {
        fontSize: 16,
        textAlign: 'center',
    },
    labelContainer: {
        marginTop: 10,
    },
    label: {
        fontSize: 16,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 25,
        padding: 10,
        marginTop: 10,
    },
    errorText: {
        color: 'red',
        marginTop: 3,
    },
    buttonContainer: {
        marginTop: 20,
    },
    button: {
        backgroundColor: '#0198A5',
        padding: 16,
        borderRadius: 25,
        alignItems: 'center',
        width: '100%',
        marginVertical: 16,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default ForgetPassword;