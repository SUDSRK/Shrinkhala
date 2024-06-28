import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height: viewportHeight } = Dimensions.get('window');

// Import the images directly
const backgroundImage = require('../../assets/images/splashscreenbg.jpg');
const logo = require('../../assets/images/logo-white.png');

const Logo: React.FC = () => {
    const router = useRouter();
    const [textVisible, setTextVisible] = useState(true);

    const navigate = async () => {
        setTextVisible(false);
        const username = await AsyncStorage.getItem('userName');
        if (username) {
            router.push('/Dashboard');
        } else {
            router.push('/Welcome');
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate();
        }, 1000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
            <View style={[styles.overlay, { height: viewportHeight }]}>
                <TouchableOpacity onPress={navigate}>
                    <Image source={logo} style={styles.logo} />
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
        width: 200,
        height: 200,
        resizeMode: 'contain',
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
