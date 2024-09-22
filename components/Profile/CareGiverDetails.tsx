import React from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, ScrollView } from 'react-native';

// Get screen dimensions
const { width } = Dimensions.get('window');

// Define the type for the Caregiver data structure
interface CareGiverData {
    care_giver_first_name: string;
    care_giver_last_name: string;
    care_giver_mobile_number: string;
    care_giver_relation: string;
}

// Define the props for the CareGiverDetails component
interface CareGiverDetailsProps {
    data: CareGiverData;
    setData: (data: CareGiverData) => void;
    editable: boolean;
}

const CareGiverDetails: React.FC<CareGiverDetailsProps> = ({ data, setData, editable }) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.sectionTitle}>Care Giver's Details</Text>

            {/* First Name and Last Name in one row */}
            <View style={styles.row}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        style={[styles.input, { color: editable ? 'black' : 'grey' }]}
                        placeholder="First Name"
                        value={data.care_giver_first_name || ''}
                        onChangeText={(value) => setData({ ...data, care_giver_first_name: value })}
                        editable={editable}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                        style={[styles.input, { color: editable ? 'black' : 'grey' }]}
                        placeholder="Last Name"
                        value={data.care_giver_last_name || ''}
                        onChangeText={(value) => setData({ ...data, care_giver_last_name: value })}
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
                    value={data.care_giver_mobile_number || ''}
                    onChangeText={(value) => setData({ ...data, care_giver_mobile_number: value })}
                    editable={editable}
                    keyboardType="numeric"
                />
            </View>

            {/* Relationship (Full Width) */}
            <View style={styles.inputContainerFullWidth}>
                <Text style={styles.label}>Relationship</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Relationship"
                    value={data.care_giver_relation || ''}
                    onChangeText={(value) => setData({ ...data, care_giver_relation: value })}
                    editable={editable}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        paddingHorizontal: width * 0.05, // Responsive padding based on screen width
        paddingVertical: width * 0.03, // Responsive vertical padding
        width: '100%',
    },
    sectionTitle: {
        fontSize: width * 0.05, // Responsive font size
        fontWeight: 'bold',
        marginBottom: width * 0.03, // Responsive margin
        textAlign: 'left',
        color: '#333',
    },
    label: {
        fontSize: width * 0.03, // Responsive font size
        marginBottom: width * 0.015, // Responsive margin
        color: '#555',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: width * 0.02, // Responsive vertical padding
        paddingHorizontal: width * 0.03, // Responsive horizontal padding
        backgroundColor: '#f9f9f9',
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: width * 0.02, // Responsive margin
    },
    inputContainer: {
        flex: 1,
        marginHorizontal: width * 0.01, // Responsive margin
    },
    inputContainerFullWidth: {
        marginVertical: width * 0.02, // Responsive margin
        width: '100%',
    },
});

export default CareGiverDetails;
