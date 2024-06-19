import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login: React.FC = () => {
    const router = useRouter();
    const [userId, setUserId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [loginMethod, setLoginMethod] = useState<'mobile' | 'uid'>('mobile'); // Default to login via mobile
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
            console.log(apiUrl + ' ' + JSON.stringify(payload));

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
                        AsyncStorage.setItem('userName', user_id); // Save user_id to local storage

                        // Fetch additional user data
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
                    // Save phone number and first name + last name to local storage
                    const { phone_number, first_name, last_name } = userData;
                    AsyncStorage.setItem('phone_number', phone_number.toString());
                    AsyncStorage.setItem('fullName', `${first_name} ${last_name}`);

                    // Navigate to dashboard upon successful login
                    router.push('/dashboard');
                })
                .catch(error => {
                    // Handle error
                    setErrorMsg("Phone Number/UserID or Password is incorrect");
                    console.error('There was a problem with the login request:', error);
                });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Shrinkhala</Text>
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
                    <Link href="/SignUp" asChild>
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
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#0198A5',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0198A5',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: '#4fd1c5',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    activeButton: {
        backgroundColor: '#38b2ac',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#718096',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    submitButton: {
        backgroundColor: '#0198A5',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorMsg: {
        color: 'red',
        marginBottom: 20,
    },
    linkText: {
        color: '#0198A5',
        textAlign: 'center',
        marginTop: 10,
    },
    signUpText: {
        textAlign: 'center',
        marginTop: 20,
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
        height: 20,
    },
    footerText: {
        color: '#333',
        fontSize: 12,
    },
});

export default Login;
