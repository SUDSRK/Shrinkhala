import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Dimensions } from 'react-native';

// Get screen dimensions
const { width } = Dimensions.get('window');

// Define the type for the Kin data structure
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

// Define the props for the KinDetails component
interface KinDetailsProps {
    data: KinData;
    setData: (data: KinData) => void;
    editable: boolean;
}

const KinDetails: React.FC<KinDetailsProps> = ({ data, setData, editable }) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.sectionTitle}>Kin's Details</Text>

            {/* First Name and Last Name in one row */}
            <View style={styles.row}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        style={[styles.input, { color: editable ? 'black' : 'grey' }]}
                        placeholder="First Name"
                        value={data.Kin_First_name || ''}
                        onChangeText={(value) => setData({ ...data, Kin_First_name: value })}
                        editable={editable}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                        style={[styles.input, { color: editable ? 'black' : 'grey' }]}
                        placeholder="Last Name"
                        value={data.Kin_Last_name || ''}
                        onChangeText={(value) => setData({ ...data, Kin_Last_name: value })}
                        editable={editable}
                    />
                </View>
            </View>

            {/* Mobile Number (Full Width) */}
            <View style={styles.inputContainerFullWidth}>
                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                    style={[styles.input, { color: editable ? 'black' : 'grey' }]}
                    placeholder="Mobile Number"
                    value={data.Kin_mobile_number || ''}
                    onChangeText={(value) => setData({ ...data, Kin_mobile_number: value })}
                    editable={editable}
                    keyboardType="numeric"
                />
            </View>

            {/* Relationship with Patient (Full Width) */}
            <View style={styles.inputContainerFullWidth}>
                <Text style={styles.label}>Relationship with Patient</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Relationship"
                    value={data.Kin_relationship_with_patient || ''}
                    onChangeText={(value) => setData({ ...data, Kin_relationship_with_patient: value })}
                    editable={editable}
                />
            </View>

            {/* House No (Full Width) */}
            <View style={styles.inputContainerFullWidth}>
                <Text style={styles.label}>House No, Road or Street</Text>
                <TextInput
                    style={styles.input}
                    placeholder="House No"
                    value={data.Kin_House_no || ''}
                    onChangeText={(value) => setData({ ...data, Kin_House_no: value })}
                    editable={editable}
                />
            </View>

            {/* Locality (Full Width) */}
            <View style={styles.inputContainerFullWidth}>
                <Text style={styles.label}>Locality</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Locality"
                    value={data.Kin_Locality || ''}
                    onChangeText={(value) => setData({ ...data, Kin_Locality: value })}
                    editable={editable}
                />
            </View>

            {/* City and District in one row */}
            <View style={styles.row}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>City</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="City"
                        value={data.Kin_city || ''}
                        onChangeText={(value) => setData({ ...data, Kin_city: value })}
                        editable={editable}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>District</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="District"
                        value={data.Kin_district || ''}
                        onChangeText={(value) => setData({ ...data, Kin_district: value })}
                        editable={editable}
                    />
                </View>
            </View>

            {/* State and PIN Code in one row */}
            <View style={styles.row}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>State</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="State"
                        value={data.Kin_state || ''}
                        onChangeText={(value) => setData({ ...data, Kin_state: value })}
                        editable={editable}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>PIN Code</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="PIN Code"
                        keyboardType="numeric"
                        value={data.Kin_pin_code || ''}
                        onChangeText={(value) => setData({ ...data, Kin_pin_code: value })}
                        editable={editable}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        paddingHorizontal: width * 0.05, // Adjust padding based on screen width
        paddingVertical: width * 0.03, // Adjust padding based on screen width
        width: '100%', // Use the full screen width
    },
    sectionTitle: {
        fontSize: width * 0.045, // Adjust font size based on screen width
        fontWeight: 'bold',
        marginBottom: width * 0.03, // Adjust margin based on screen width
        textAlign: 'left',
        color: '#333',
    },
    label: {
        fontSize: width * 0.03, // Adjust font size for smaller screens
        marginBottom: width * 0.015, // Adjust margin based on screen width
        color: '#555',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: width * 0.02, // Adjust padding for smaller screens
        paddingHorizontal: width * 0.03, // Adjust padding for smaller screens
        backgroundColor: '#f9f9f9',
        width: '100%', // Ensures input takes full available width
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: width * 0.02, // Adjust margin based on screen width
    },
    inputContainer: {
        flex: 1,
        marginHorizontal: width * 0.01, // Minimal margin to maximize screen space utilization
    },
    inputContainerFullWidth: {
        marginVertical: width * 0.02, // Adjust margin based on screen width
        width: '100%', // Ensures full width
    },
});

export default KinDetails;
