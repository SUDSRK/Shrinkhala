import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get the screen dimensions
const { width, height } = Dimensions.get('window');

const Login: React.FC = () => {
    const router = useRouter();
    const [userId, setUserId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [loginMethod, setLoginMethod] = useState<'mobile' | 'uid'>('mobile');
    const [continueDisable, setContinueDisable] = useState<boolean>(true);

    const handleUserIdChange = (text: string) => {
        setUserId(text);
        if (text.length === 10) {
            setContinueDisable(false);
        }
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
    };

    const handleSubmit = () => {
        setErrorMsg("");
        if (!userId || !password) {
            setErrorMsg("Please Enter UserId & Password");
        } else {
            const apiUrl = loginMethod === 'mobile' ? 'https://api.shrinkhala.in/patient/signin_phone' : 'https://api.shrinkhala.in/patient/login_uuid';
            const payload = loginMethod === 'mobile' ? { phone_number: userId, password: password } : { user_id: userId, password: password };

            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                referrerPolicy: 'strict-origin-when-cross-origin'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.user_id) {
                        const { user_id } = data;
                        AsyncStorage.setItem('userName', user_id);

                        return fetch(`https://api.shrinkhala.in/patient/${user_id}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            referrerPolicy: 'strict-origin-when-cross-origin'
                        });
                    } else {
                        throw new Error('User ID not found in response');
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(userData => {
                    const { phone_number, first_name, last_name } = userData;
                    AsyncStorage.setItem('phone_number', phone_number.toString());
                    AsyncStorage.setItem('fullName', `${first_name} ${last_name}`);
                    router.push('/Dashboard');
                })
                .catch(error => {
                    setErrorMsg("Phone Number/UserID or Password is incorrect");
                    console.error('There was a problem with the login request:', error);
                });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('../assets/images/icon-blue.png')} // Replace this path with your actual image path
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
            <Text style={styles.subtitle}>Login via</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.loginButton, loginMethod === 'mobile' ? styles.activeButton : null]}
                    onPress={() => setLoginMethod('mobile')}
                >
                    <Text style={styles.loginButtonText}>Mobile No.</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.loginButton, loginMethod === 'uid' ? styles.activeButton : null]}
                    onPress={() => setLoginMethod('uid')}
                >
                    <Text style={styles.loginButtonText}>UID No.</Text>
                </TouchableOpacity>
            </View>
            <View>
                {loginMethod === 'mobile' ? (
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Enter your Mobile Number:</Text>
                        <TextInput
                            style={styles.input}
                            maxLength={10}
                            keyboardType="numeric"
                            onChangeText={handleUserIdChange}
                        />
                    </View>
                ) : (
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Enter your UID:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={handleUserIdChange}
                        />
                    </View>
                )}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Enter Password:</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        onChangeText={handlePasswordChange}
                    />
                </View>
                {errorMsg ? <Text style={styles.errorMsg}>{errorMsg}</Text> : null}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Continue</Text>
                </TouchableOpacity>
                <Link href="/forgetpassword" asChild>
                    <TouchableOpacity>
                        <Text style={styles.linkText}>Forget Password?</Text>
                    </TouchableOpacity>
                </Link>
                <Text style={styles.signUpText}>
                    Don't have an account?{' '}
                    <Link href="/Signup" asChild>
                        <Text style={styles.signUpLink}>Sign Up</Text>
                    </Link>
                </Text>
            </View>
            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>A unit of : Ninety Seven Medicare Private Limited</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: width * 0.05, // Adjust padding based on screen width
        justifyContent: 'center',
    },
    header: {
        marginBottom: height * 0.02, // Responsive margin
        alignItems: 'center', // Center the logo horizontally
    },
    logo: {
        width: width * 0.5, // Responsive width
        height: height * 0.1, // Responsive height
    },
    subtitle: {
        fontSize: width * 0.045, // Responsive font size
        fontWeight: 'bold',
        color: '#0198A5',
        marginBottom: height * 0.015, // Responsive margin
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: height * 0.02, // Responsive margin
    },
    loginButton: {
        backgroundColor: '#4fd1c5',
        paddingVertical: height * 0.012, // Responsive padding
        paddingHorizontal: width * 0.05, // Responsive padding
        borderRadius: 8,
    },
    activeButton: {
        backgroundColor: '#38b2ac',
    },
    loginButtonText: {
        color: 'white',
        fontSize: width * 0.04, // Responsive font size
        fontWeight: 'bold',
    },
    inputContainer: {
        marginBottom: height * 0.015, // Responsive margin
    },
    label: {
        fontSize: width * 0.04, // Responsive font size
        color: '#718096',
        marginBottom: height * 0.005, // Responsive margin
    },
    input: {
        height: height * 0.05, // Responsive height
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: width * 0.03, // Responsive padding
    },
    submitButton: {
        backgroundColor: '#0198A5',
        paddingVertical: height * 0.02, // Responsive padding
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: width * 0.045, // Responsive font size
        fontWeight: 'bold',
    },
    errorMsg: {
        color: 'red',
        marginBottom: height * 0.01, // Responsive margin
        textAlign: 'center',
    },
    linkText: {
        color: '#0198A5',
        textAlign: 'center',
        marginTop: height * 0.01, // Responsive margin
    },
    signUpText: {
        textAlign: 'center',
        marginTop: height * 0.02, // Responsive margin
    },
    signUpLink: {
        color: '#0198A5',
        textDecorationLine: 'underline',
    },
    footerContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        height: height * 0.05, // Responsive height
    },
    footerText: {
        color: '#333',
        fontSize: width * 0.03, // Responsive font size
    },
});

export default Login;
