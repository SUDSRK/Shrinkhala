import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
    Dashboard: undefined;
    ForgetPassword: undefined;
    RegistrationForm: undefined;
};

const Login: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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
            const apiUrl = loginMethod === 'mobile' ? 'http://34.131.227.229:8081/patient/signin_phone' : 'http://34.131.227.229:8081/patient/login_uuid';
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
                    // Handle successful login response
                    navigation.navigate('Dashboard'); // Navigate to dashboard upon successful login
                })
                .catch(error => {
                    // Handle error
                    setErrorMsg("Phone Number/UserID or Password is incorrect");
                    console.error('There was a problem with the login request:', error);
                });
        }
    };

    const forgetPasswordFunction = () => {
        navigation.navigate('ForgetPassword');
    };

    const goToSignUp = () => {
        navigation.navigate('RegistrationForm');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Shrinkhala</Text>
            <Text style={styles.subtitle}>Login via</Text>
            <View style={styles.buttonContainer}>
                <Button title="Mobile No." onPress={() => setLoginMethod('mobile')} color={loginMethod === 'mobile' ? '#38b2ac' : '#4fd1c5'} />
                <Button title="UID No." onPress={() => setLoginMethod('uid')} color={loginMethod === 'uid' ? '#38b2ac' : '#4fd1c5'} />
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
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={continueDisable}>
                    <Text style={styles.submitButtonText}>Continue</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={forgetPasswordFunction}>
                    <Text style={styles.linkText}>Forget Password?</Text>
                </TouchableOpacity>
                <Text style={styles.signUpText}>
                    Don't have an account?{' '}
                    <Text style={styles.signUpLink} onPress={goToSignUp}>
                        Sign Up
                    </Text>
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
