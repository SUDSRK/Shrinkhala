import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, Dimensions, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const CreateNewPassword: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setErrorMessage(''); // Reset error message when input changes
  };

  const handleReEnteredPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setErrorMessage(''); // Reset error message when input changes
  };

  const handleSubmit = () => {
    if (!password || !confirmPassword) {
      setErrorMessage('Both password fields are required');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    // If everything is valid
    try {
      Alert.alert("Success", "Your password has been changed successfully.");
      navigation.navigate('loginpage');
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  return (
      <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Create New Password</Text>
            <Image source={require('../assets/images/createNewPassword.png')} style={styles.image} />
            <Text style={styles.instruction}>
              Your new password must be different from the previously used password.
            </Text>
            <Text style={styles.label}>Enter New Password</Text>
            <TextInput
                secureTextEntry
                style={styles.input}
                maxLength={16}
                value={password}
                placeholder='Enter Password'
                onChangeText={handlePasswordChange}
            />
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
                secureTextEntry
                style={styles.input}
                maxLength={16}
                value={confirmPassword}
                placeholder='Re-enter Password'
                onChangeText={handleReEnteredPasswordChange}
            />
            {errorMessage ? <Text style={styles.errorMsg}>{errorMessage}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Save Password</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    padding: width * 0.05,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: width > 600 ? 28 : 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: height * 0.02,
  },
  image: {
    width: '100%',
    height: height * 0.25,
    resizeMode: 'contain',
    marginVertical: height * 0.02,
  },
  instruction: {
    fontSize: width > 600 ? 18 : 16,
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: width > 600 ? 18 : 16,
    marginBottom: height * 0.01,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    fontSize: width > 600 ? 18 : 16,
    marginBottom: height * 0.02,
    width: '100%',
  },
  errorMsg: {
    color: 'red',
    fontSize: width > 600 ? 16 : 14,
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0198A5',
    paddingVertical: height * 0.02,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    marginTop: height * 0.02,
  },
  buttonText: {
    color: 'white',
    fontSize: width > 600 ? 18 : 16,
  },
});

export default CreateNewPassword;
