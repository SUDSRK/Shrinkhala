import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileDetails from '../components/Profile/ProfileDetails';
import CareGiverDetails from '../components/Profile/CareGiverDetails';
import KinDetails from '../components/Profile/KinDetails';
import {useRouter} from "expo-router";

const { width, height } = Dimensions.get('window');

interface PatientData {
    first_name: string;
    last_name: string;
    age: number | string;
    gender: string;
    marital_status: string;
    p_city: string;
    p_district: string;
    p_house_no: string;
    p_locality: string;
    p_pin_code: string;
    p_state: string;
    phone_number: string | number;
    alternate_mobile_number: string | number;
}

interface CareGiverData {
    care_giver_first_name: string;
    care_giver_last_name: string;
    care_giver_mobile_number: string;
    care_giver_relation: string;
}

interface KinData {
    Kin_First_name: string;
    Kin_Last_name: string;
    Kin_mobile_number: string;
    Kin_relationship_with_patient: string;
    Kin_House_no: string;
    Kin_Locality: string;
    Kin_pin_code: string;
    Kin_city: string;
    Kin_district: string;
    Kin_state: string;
}

const Profile = () => {
    // State variables
    const [data, setData] = useState<PatientData>({
        first_name: '',
        last_name: '',
        age: '',
        gender: '',
        marital_status: '',
        p_city: '',
        p_district: '',
        p_house_no: '',
        p_locality: '',
        p_pin_code: '',
        p_state: '',
        phone_number: '',
        alternate_mobile_number: '',
    });

    const [careGiverData, setCareGiverData] = useState<CareGiverData>({
        care_giver_first_name: '',
        care_giver_last_name: '',
        care_giver_mobile_number: '',
        care_giver_relation: '',
    });

    const [kinData, setKinData] = useState<KinData>({
        Kin_First_name: '',
        Kin_Last_name: '',
        Kin_mobile_number: '',
        Kin_relationship_with_patient: '',
        Kin_House_no: '',
        Kin_Locality: '',
        Kin_pin_code: '',
        Kin_city: '',
        Kin_district: '',
        Kin_state: '',
    });
    const router = useRouter();
    const [editable, setEditable] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('Patient');

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const storedUserName = await AsyncStorage.getItem('userName');
                if (storedUserName) {
                    setUserName(storedUserName);
                }
            } catch (error) {
                console.error('Failed to load userName from storage', error);
            }
        };
        fetchUserName();
    }, []);

    useEffect(() => {
        if (userName) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`https://api.shrinkhala.in/patient/${userName}`);
                    const json = await response.json();
                    setData({
                        first_name: json.first_name || '',
                        last_name: json.last_name || '',
                        age: json.age || '',
                        gender: json.gender || '',
                        marital_status: json.marital_status || '',
                        p_city: json.p_city || '',
                        p_district: json.p_district || '',
                        p_house_no: json.p_house_no || '',
                        p_locality: json.p_locality || '',
                        p_pin_code: json.p_pin_code || '',
                        p_state: json.p_state || '',
                        phone_number: json.phone_number || '',
                        alternate_mobile_number: json.alternate_mobile_number || '',
                    });

                    setCareGiverData({
                        care_giver_first_name: json.care_giver_first_name || '',
                        care_giver_last_name: json.care_giver_last_name || '',
                        care_giver_mobile_number: json.care_giver_mobile_number || '',
                        care_giver_relation: json.care_giver_relation || '',
                    });

                    setKinData({
                        Kin_First_name: json.Kin_First_name || '',
                        Kin_Last_name: json.Kin_Last_name || '',
                        Kin_mobile_number: json.Kin_mobile_number || '',
                        Kin_relationship_with_patient: json.Kin_relationship_with_patient || '',
                        Kin_House_no: json.Kin_House_no || '',
                        Kin_Locality: json.Kin_Locality || '',
                        Kin_pin_code: json.Kin_pin_code || '',
                        Kin_city: json.Kin_city || '',
                        Kin_district: json.Kin_district || '',
                        Kin_state: json.Kin_state || '',
                    });
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }
    }, [userName]);

    const handleSave = async () => {
        try {
            if (!userName) {
                Alert.alert('Error', 'Unable to save data. Please try again later');
                return;
            }

            const updatedData = {
                ...data,
                ...careGiverData,
                ...kinData,
            };

            const response = await fetch(`https://api.shrinkhala.in/patient/${userName}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                Alert.alert('Success', 'User data updated successfully');
                setEditable(false);
            } else {
                console.error('Error response:', response);
                Alert.alert('Error', 'Failed to update user data');
            }
        } catch (error) {
            console.error('Error updating data:', error);
            Alert.alert('Error', 'An unexpected error occurred while updating user data');
        }
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete your account? This action cannot be undone, and you will lose all your data.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Deletion cancelled"),
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            if (userName) {
                                await fetch(`https://api.shrinkhala.in/patient/${userName}`, {
                                    method: 'DELETE',
                                });
                                Alert.alert('Success', 'Account deleted successfully');
                                AsyncStorage.clear(); // Clear user data from AsyncStorage
                                // You can redirect to the login screen here if needed
                            }
                        } catch (error) {
                            console.error('Error deleting account:', error);
                            Alert.alert('Error', 'Failed to delete account');
                        }
                    },
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.clear();
            Alert.alert('Success', 'You have been logged out');
            router.push( 'Welcome');
        } catch (error) {
            console.error('Error clearing local storage:', error);
            Alert.alert('Error', 'Failed to log out');
        }
    };

    const renderActiveTabContent = () => {
        switch (activeTab) {
            case 'Patient':
                return <ProfileDetails data={data} setData={setData} editable={editable} />;
            case 'Care Giver':
                return <CareGiverDetails data={careGiverData} setData={setCareGiverData} editable={editable} />;
            case 'Kin\'s Details':
                return <KinDetails data={kinData} setData={setKinData} editable={editable} />;
            default:
                return null;
        }
    };

    return (
        <View style={styles.wrapper}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>
                    {data.first_name && data.last_name ? `${data.first_name} ${data.last_name}` : 'Loading...'}
                </Text>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* Custom Tab Navigation */}
            <View style={styles.tabContainer}>
                {['Patient', 'Care Giver', 'Kin\'s Details'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tabButton,
                            activeTab === tab && styles.activeTab,
                        ]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Tab Content */}
            <ScrollView contentContainerStyle={styles.contentContainer}>
                {renderActiveTabContent()}
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => setEditable(!editable)}>
                    <Text style={styles.editButtonText}>{editable ? 'Cancel' : 'Edit Profile'}</Text>
                </TouchableOpacity>

                {editable && (
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
                    <Text style={styles.deleteButtonText}>Delete Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

    const styles = StyleSheet.create({
        wrapper: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: width * 0.05 }, // Responsive padding
        headerContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: height * 0.02, // Adjust padding based on screen height
        },
        headerText: { fontSize: width * 0.05, fontWeight: 'bold', color: '#333' }, // Font size relative to screen width
        logoutButton: {
            backgroundColor: '#FEECF0',
            paddingVertical: height * 0.01,
            paddingHorizontal: width * 0.04,
            borderRadius: 10,
        },
        logoutButtonText: { color: '#FF4757', fontWeight: 'bold' },
        tabContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: '#F0F0F0',
            borderRadius: 20,
            marginVertical: height * 0.02, // Adjust margin based on screen height
            padding: 5,
        },
        tabButton: { flex: 1, paddingVertical: height * 0.015, alignItems: 'center', borderRadius: 20 },
        activeTab: { backgroundColor: '#38A3A5' },
        tabText: { color: '#A1A1A1', fontSize: width * 0.04 }, // Relative font size
        activeTabText: { color: '#FFFFFF' },
        contentContainer: {
            backgroundColor: '#FFFFFF',
            borderRadius: 10,
            padding: 0,
            marginTop: height * 0.01,
        },
        buttonsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: height * 0.03,
        },
        editButton: {
            backgroundColor: '#007bff',
            paddingVertical: height * 0.015,
            paddingHorizontal: width * 0.05,
            borderRadius: 5,
        },
        editButtonText: { color: '#fff', fontWeight: 'bold', fontSize: width * 0.04 }, // Responsive font size
        saveButton: {
            backgroundColor: '#28a745',
            paddingVertical: height * 0.015,
            paddingHorizontal: width * 0.05,
            borderRadius: 5,
        },
        saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: width * 0.04 },
        deleteButton: {
            backgroundColor: '#dc3545',
            paddingVertical: height * 0.015,
            paddingHorizontal: width * 0.05,
            borderRadius: 5,
        },
        deleteButtonText: { color: '#fff', fontWeight: 'bold', fontSize: width * 0.04 },
    });

export default Profile;
