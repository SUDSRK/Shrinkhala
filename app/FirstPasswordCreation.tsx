import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  userName: string | null;
  phoneNumber: string | null;
}

const { width, height } = Dimensions.get('window');

const FirstPasswordCreation: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigation = useNavigation<NavigationProp<any>>();

  // Function to get user data from AsyncStorage
  const getUserData = async (): Promise<UserData> => {
    const userName = await AsyncStorage.getItem('userName');
    const phoneNumber = await AsyncStorage.getItem('phoneNumber');
    return { userName, phoneNumber };
  };

  // Update password state
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setErrorMessage(''); // Reset error message when input changes
  };

  // Update confirm password state
  const handleReEnteredPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setErrorMessage(''); // Reset error message when input changes
  };

  // Handle the form submission
  const handleSubmit = async () => {
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

    const { userName, phoneNumber } = await getUserData();
    try {
      const response = await fetch('https://api.shrinkhala.in/patient/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userName,
          phone_number: phoneNumber,
          password: password,
        }),
      });
      if (response.ok) {
        Alert.alert('Success', 'Your password has been saved successfully.');
        navigation.navigate('Dashboard');
      } else {
        console.error('Error:', response.statusText);
        Alert.alert('Error', 'Failed to save the password');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to save the password');
    }
  };

  return (
      <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollViewContainer}
          keyboardShouldPersistTaps="always" // Ensure taps are registered even when the keyboard is open
      >
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Create Password</Text>
          <Image
              source={require('../assets/images/createNewPassword.png')}
              style={styles.image}
          />
          <Text style={styles.instruction}>
            Your Password must be strong and easy to remember
          </Text>
          <Text style={styles.label}>Enter New Password</Text>
          <TextInput
              secureTextEntry
              style={styles.input}
              maxLength={16}
              value={password}
              placeholder="Enter Password"
              onChangeText={handlePasswordChange}
          />
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
              secureTextEntry
              style={styles.input}
              maxLength={16}
              value={confirmPassword}
              placeholder="Re-enter Password"
              onChangeText={handleReEnteredPasswordChange}
          />
          {errorMessage ? <Text style={styles.errorMsg}>{errorMessage}</Text> : null}
          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit} activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>Save Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContainer: {
    paddingHorizontal: '5%', // Adjust padding for better responsiveness
    paddingTop: 20, // Start the content from the top
  },
  innerContainer: {
    flex: 1,
  },
  title: {
    fontSize: width > 600 ? 24 : 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: height * 0.25,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  instruction: {
    fontSize: width > 600 ? 16 : 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: width > 600 ? 16 : 14,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: width > 600 ? 16 : 14,
    marginBottom: 15,
    borderRadius: 25,
    width: '100%',
  },
  errorMsg: {
    color: 'red',
    fontSize: width > 600 ? 14 : 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#0198A5',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: width > 600 ? 16 : 14,
  },
});

export default FirstPasswordCreation;
