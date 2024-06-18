import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

// Assuming the SVG and PNG images are correctly configured to be imported as React components or static resources
// import BackIcon from '../../assets/back.svg'; // Use a library like 'react-native-svg' to handle SVGs
// import createNewPasswordImage from '../../assets/createNewPassword.png'; // Direct import for PNG

const CreateNewPassword: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);

  const backButtonHandler = () => {
    navigation.navigate('ForgetOtpScreen');
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };

  const handleReEnteredPasswordChange = (text: string) => {
    setConfirmPassword(text);
  };

  const handleSubmit = () => {
    if (password === confirmPassword) {
      // Passwords match, proceed with logic
      console.log('Passwords match:', password);
      Alert.alert("Password Changed");
      navigation.navigate('loginpage');
    } else {
      // Passwords do not match, show error
      setPasswordsMatch(false);
      console.log('Passwords do not match');
    }
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={backButtonHandler}>
        <Image source={BackIcon} style={styles.backIcon} />
      </TouchableOpacity> */}
      <Text style={styles.title}>Create New Password</Text>
      <Image source={require('../assets/images/createNewPassword.png')} style={styles.image} />
      <Text style={styles.instruction}>
        Your new password must be different from the previously used password.
      </Text>
      <Text style={styles.label}>Enter New Password</Text>
      <TextInput
        secureTextEntry
        style={styles.input}
        maxLength={10}
        value={password}
        placeholder='Enter Password'
        onChangeText={handlePasswordChange}
      />
      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        secureTextEntry
        style={styles.input}
        maxLength={10}
        value={confirmPassword}
        placeholder='Re-enter Password'
        onChangeText={handleReEnteredPasswordChange}
      />
      {!passwordsMatch && <Text style={styles.errorMsg}>Passwords do not match</Text>}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  errorMsg: {
    color: 'red',
    marginBottom: 20,
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

export default CreateNewPassword;
