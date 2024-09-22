import React from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, ScrollView } from 'react-native';

// Get screen dimensions
const { width } = Dimensions.get('window');

// Extend the data structure to include additional fields
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

// Define the props for the ProfileDetails component
interface ProfileDetailsProps {
    data: PatientData;
    setData: (data: PatientData) => void;
    editable: boolean;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ data, setData, editable }) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.sectionTitle}>Patient's Details</Text>

            {/* First Name and Last Name in one row */}
            <View style={styles.row}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        style={[styles.input, { color: editable ? 'black' : 'grey' }]}
                        placeholder="First Name"
                        value={data.first_name || ''}
                        onChangeText={(value) => setData({ ...data, first_name: value })}
                        editable={editable}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                        style={[styles.input, { color: editable ? 'black' : 'grey' }]}
                        placeholder="Last Name"
                        value={data.last_name || ''}
                        onChangeText={(value) => setData({ ...data, last_name: value })}
                        editable={editable}
                    />
                </View>
            </View>

            {/* Age and Gender in one row */}
            <View style={styles.row}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Age</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Age"
                        value={String(data.age)}
                        onChangeText={(value) => setData({ ...data, age: value })}
                        keyboardType="numeric"
                        editable={editable}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Gender</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Gender"
                        value={data.gender || ''}
                        onChangeText={(value) => setData({ ...data, gender: value })}
                        editable={editable}
                    />
                </View>
            </View>

            {/* Marital Status (Full Width) */}
            <View style={styles.inputContainerFullWidth}>
                <Text style={styles.label}>Marital Status</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Marital Status"
                    value={data.marital_status || ''}
                    onChangeText={(value) => setData({ ...data, marital_status: value })}
                    editable={editable}
                />
            </View>

            {/* House Number (Full Width) */}
            <View style={styles.inputContainerFullWidth}>
                <Text style={styles.label}>House No, Road or Street</Text>
                <TextInput
                    style={styles.input}
                    placeholder="House No, Road or Street"
                    value={data.p_house_no || ''}
                    onChangeText={(value) => setData({ ...data, p_house_no: value })}
                    editable={editable}
                />
            </View>

            {/* Locality (Full Width) */}
            <View style={styles.inputContainerFullWidth}>
                <Text style={styles.label}>Locality</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Locality"
                    value={data.p_locality || ''}
                    onChangeText={(value) => setData({ ...data, p_locality: value })}
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
                        value={data.p_city || ''}
                        onChangeText={(value) => setData({ ...data, p_city: value })}
                        editable={editable}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>District</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="District"
                        value={data.p_district || ''}
                        onChangeText={(value) => setData({ ...data, p_district: value })}
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
                        value={data.p_state || ''}
                        onChangeText={(value) => setData({ ...data, p_state: value })}
                        editable={editable}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>PIN Code</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="PIN Code"
                        keyboardType="numeric"
                        value={data.p_pin_code || ''}
                        onChangeText={(value) => setData({ ...data, p_pin_code: value })}
                        editable={editable}
                    />
                </View>
            </View>

            {/* Mobile Number (Full Width) */}
            <View style={styles.inputContainerFullWidth}>
                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                    style={[styles.input, { color: 'grey' }]} // Non-editable field
                    placeholder="Mobile Number"
                    keyboardType="numeric"
                    value={String(data.phone_number) || ''}
                    editable={false}
                />
            </View>

            {/* Alternate Mobile Number (Full Width) */}
            <View style={styles.inputContainerFullWidth}>
                <Text style={styles.label}>Alternate Mobile Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Alternate Mobile Number"
                    keyboardType="numeric"
                    value={String(data.alternate_mobile_number) || ''}
                    onChangeText={(value) => setData({ ...data, alternate_mobile_number: value })}
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
        paddingHorizontal: width * 0.05, // Responsive padding
        paddingVertical: width * 0.03, // Responsive padding
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
        marginBottom: width * 0.02, // Responsive margin
        color: '#555',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: width * 0.02, // Responsive padding
        paddingHorizontal: width * 0.03, // Responsive padding
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

export default ProfileDetails;
