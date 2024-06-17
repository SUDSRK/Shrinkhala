import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUp: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [isValid, setIsValid] = useState<boolean>(true);
    const [numberErrorMsg, setNumberErrorMsg] = useState<string>('');
    const [numberError, setNumberError] = useState<boolean>(false);
    const router = useRouter();

    const numberValidator = (value: string) => {
        setInputValue(value);
        setIsValid(!isNaN(Number(value)));
    };

    const backButtonHandler = () => {
        router.push('/login');
    };

    const numberSubmit = async () => {
        console.log('inputValue-', inputValue);

        if (inputValue.length === 10) {
            setNumberError(false);
            await AsyncStorage.setItem('phoneNumber', inputValue);
            router.push({ pathname: '/otpscreen', params: { phoneNumber: inputValue } });
        } else {
            setNumberError(true);
            setNumberErrorMsg('Please enter a 10 digit phone number.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Shrinkhala</Text>
            </View>
            <View style={styles.subHeader}>
                <Text style={styles.subTitle}>Please register yourself</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.spacer} />

                <View style={styles.inputLabel}>
                    <Text style={styles.labelText}>Enter mobile number:</Text>
                </View>

                <View style={styles.inputContainer}>

                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        maxLength={10}
                        value={inputValue}
                        placeholder="Mobile Number"
                        onChangeText={numberValidator}
                    />
                </View>
                {!isValid && <Text style={styles.errorText}>Please enter a valid number</Text>}
                {numberError && <Text style={styles.errorText}>{numberErrorMsg}</Text>}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.continueButton} onPress={numberSubmit}>
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    header: {
        marginTop: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#0198A5',
    },
    subHeader: {
        marginTop: 20,
        paddingTop: 40,
    },
    subTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    form: {
        marginTop: 20,
    },
    spacer: {
        height: 20,
    },
    inputLabel: {
        marginTop: 10,
        paddingBottom: 20,
        paddingLeft: 10,
        alignItems: 'center',
    },
    labelText: {
        fontSize: 18,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 50,
        padding: 15,
        marginRight: 24,
        flex: 1,
    },
    errorText: {
        color: 'red',
        marginTop: 7,
        marginLeft: 35,
    },
    buttonContainer: {
        marginTop: 30,
        marginHorizontal: 24,
    },
    continueButton: {
        backgroundColor: '#0198A5',
        borderRadius: 50,
        paddingVertical: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default SignUp;
