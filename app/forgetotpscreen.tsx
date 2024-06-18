import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardEvent,
  TextInput as RNTextInput,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native'; // Assuming you're using React Navigation for navigation

// Importing SVG and PNG images
// import BackIcon from '../../assets/back.svg'; // Consider using a library to handle SVG
// import forgetPasswordImage from '../../assets/forgetPassword.png';

const ForgetOtpScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [incorrectOtp, setIncorrectOtp] = useState<string>("");
  const inputs = useRef<RNTextInput[]>([]);

  useEffect(() => {
    setIncorrectOtp("");
  }, []);

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to the next input box
    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, key: string) => {
    // Move to the previous input box on backspace
    if (key === 'Backspace' && index > 0 && !otp[index]) {
      inputs.current[index - 1]?.focus();
    }
  };

  const backButtonHandler = () => {
    navigation.navigate('ForgetPassword');
  };

  const handleSubmit = () => {
    // Validate inputs here (e.g., check if all inputs are filled)
    console.log('Submitted OTP:', otp);
    setIsSubmitting(true);

    const otpString = otp.join('');
    if (otpString === "7044") {
      setIsSubmitting(false);
      navigation.navigate('CreateNewPassword');
    } else {
      setIsSubmitting(false);
      setIncorrectOtp("Incorrect OTP");
    }
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={backButtonHandler}>
        <Image source={BackIcon} style={styles.backImage} />
      </TouchableOpacity> */}
      <Text style={styles.title}>Verify Your Account</Text>
      <Image source={require('../assets/images/forgetPassword.png')} style={styles.image} />
      <Text style={styles.instructions}>Please enter the OTP sent to your mobile</Text>
      <View style={styles.otpContainer}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            style={styles.input}
            maxLength={1}
            value={value}
            onChangeText={(text) => handleChange(index, text)}
            onKeyPress={({ nativeEvent }) => handleKeyDown(index, nativeEvent.key)}
            ref={(input) => {
              if (input) {
                inputs.current[index] = input;
              }
            }}
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
    backgroundColor: 'white',
    padding: 16,
    alignItems: 'center',
  },
  backImage: {
    width: 20,
    height: 20,
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0198A5',
    marginVertical: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 16,
    alignItems: 'center',
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  input: {
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
    marginBottom: 16,
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
  resendText: {
    marginTop: 16,
    textAlign: 'center',
  },
});

export default ForgetOtpScreen;
