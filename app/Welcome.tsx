import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Link } from 'expo-router';

const { width, height } = Dimensions.get('window');
const logoHeight = height * 0.4;
const logoWidth = width * 0.8;

const Welcome: React.FC = () => {
    return (
        <View style={styles.container}>
            <Link href="/Login" asChild>
                <TouchableOpacity>
                    <Image source={require('../assets/images/7317079.jpg')} style={styles.logo} />
                </TouchableOpacity>
            </Link>
            <View style={styles.nav}>
                <Link href="/Login" asChild>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </Link>
                <Link href="/Signup" asChild>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Signup</Text>
                    </TouchableOpacity>
                </Link>
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        width: logoWidth,
        height: logoHeight,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    nav: {
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#0198A5',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
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

export default Welcome;