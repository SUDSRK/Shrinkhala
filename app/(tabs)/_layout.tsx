import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height: viewportHeight } = Dimensions.get('window');

// Import the image directly
const backgroundImage = require('../../assets/images/SplashScreen-bg.png');

const Logo: React.FC = () => {
    const router = useRouter();
    const [textVisible, setTextVisible] = useState(true);

    const handleLogoClick = async () => {
        setTextVisible(false);
        const username = await AsyncStorage.getItem('userName');
        if (username) {
            router.push('/dashboard');
        } else {
            router.push('/loginorsignup');
        }
    };

    return (
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
            <View style={[styles.overlay, { height: viewportHeight }]}>
                <TouchableOpacity onPress={handleLogoClick}>
                    <Text style={styles.logo}>Shrinkhala</Text>
                </TouchableOpacity>
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>A unit of : Ninety Seven Medicare Private Limited</Text>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        backgroundColor: 'rgba(56, 178, 172, 0)',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 20,
    },
    logo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    footerContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    footerText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Logo;
