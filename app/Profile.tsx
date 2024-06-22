import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, TouchableOpacity, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { format, parse } from 'date-fns'; 
import { NavigationProp, useNavigation } from '@react-navigation/native';

const Profile = () => {
    const [userName, setUserName] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [data, setData] = useState<any>({
        phone_number: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        age: '',
        gender: '',
        marital_status: '',
        alternate_mobile_number: '',
        p_house_no: '',
        p_locality: '',
        p_pin_code: '',
        p_city: '',
        p_district: '',
        p_state: '',
        care_giver_first_name: '',
        care_giver_last_name: '',
        care_giver_mobile_number: '',
        care_giver_relation: '',
        Kin_First_name: '',
        Kin_Last_name: '',
        Kin_mobile_number: '',
        Kin_House_no: '',
        Kin_Locality: '',
        Kin_pin_code: '',
        Kin_city: '',
        Kin_district: '',
        Kin_state: '',
        Kin_relationship_with_patient: ''
    });
    const [editable, setEditable] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleButtonClick = () => {
    setModalVisible(true);
  };

  const handleConfirm = () => {
    setModalVisible(false);
    fetch(`https://api.shrinkhala.in/patient/${userName}`, {
        method: 'DELETE',
    })
        .then((response) => {
            if (response.ok) {
                Alert.alert('Success', 'User deleted successfully');
                // Optionally, you can navigate back or clear the data
                AsyncStorage.clear();
                navigation.navigate('Welcome');
                setData(null);
            } else {
                Alert.alert('Error', 'Failed to delete user');
            }
        })
        .catch((error) => console.error(error));
    // console.log('Confirmed!');
  };

  const handleCancel = () => {
    setModalVisible(false);
    console.log('Cancelled!');
  };


    const navigation = useNavigation<NavigationProp<any>>();
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUserName = await AsyncStorage.getItem('userName');
                const storedName = await AsyncStorage.getItem('fullName');

                if (storedUserName) {
                    setUserName(storedUserName);
                }
                if (storedName) {
                    setName(storedName);
                }
            } catch (error) {
                console.error('Failed to load user data from storage', error);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        if (userName) {
            fetch(`https://api.shrinkhala.in/patient/${userName}`)
                .then((response) => response.json())
                .then((json) => setData(json))
                .catch((error) => console.error(error));
        }
    }, [userName]);

    const handleSave = () => {
        fetch(`https://api.shrinkhala.in/patient/${userName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((json) => {
                Alert.alert('Success', 'Data saved successfully');
                setEditable(false);
                setData(json);
            })
            .catch((error) => console.error(error));
    };
const dateString = "Sun, 04 Mar 2001 00:00:00 GMT";
const val = data.date_of_birth;
const initialDate = new Date(val);
console.log(data.date_of_birth);

const [date, setDate] = useState<Date>(initialDate);
const [show, setShow] = useState<boolean>(false);

const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

    const handleDelete = () => {
        setModalVisible(true);
    };

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
        console.log(currentDate);
        console.log(formatDateToYYYYMMDD(currentDate));
        setData({ ...data, date_of_birth: formatDateToYYYYMMDD(currentDate) });
    };

    if (!data) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.wrapper}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Shrinkhala</Text>
                <Text style={styles.title}>Your Profile Details</Text>
                {/* <Text>Please fill up the mandatory details to continue</Text> */}
                <Text style={styles.sectionTitle}>Patient's Details</Text>

                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                    style={[styles.input, { color: 'grey' }]}
                    placeholder="Mobile Number"
                    keyboardType="numeric"
                    maxLength={10}
                    value={String(data.phone_number)}
                    editable={false}
                />
                {/* <View style={styles.radioContainer}>
                    <View style={styles.radioOption}>
                        <Text>Patient</Text>
                    </View>
                </View> */}

                <View style={styles.row}>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="First Name"
                            value={data.first_name}
                            onChangeText={(value) => setData({ ...data, first_name: value })}
                            editable={editable}
                        />
                    </View>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="Last Name"
                            value={data.last_name}
                            onChangeText={(value) => setData({ ...data, last_name: value })}
                            editable={editable}
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    {/* <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>Date of Birth</Text>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.datePicker, styles.halfInput]}>
                            <Text>{formatDateToYYYYMMDD(date) || 'Date of Birth'}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}
                    </View> */}
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>Age</Text>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="Age"
                            value={String(data.age)}
                            onChangeText={(value) => setData({ ...data, age: value })}
                            keyboardType="numeric"
                            editable={editable}
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>Gender</Text>
                        <Picker
                            selectedValue={data.gender}
                            onValueChange={(value) => setData({ ...data, gender: value })}
                            enabled={editable}
                            style={styles.picker}
                        >
                            <Picker.Item label="Gender" value="" />
                            <Picker.Item label="Male" value="male" />
                            <Picker.Item label="Female" value="female" />
                            <Picker.Item label="Others" value="others" />
                        </Picker>
                    </View>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>Marital Status</Text>
                        <Picker
                            selectedValue={data.marital_status}
                            onValueChange={(value) => setData({ ...data, marital_status: value })}
                            enabled={editable}
                            style={styles.picker}
                        >
                            <Picker.Item label="Marital Status" value="" />
                            <Picker.Item label="Single" value="single" />
                            <Picker.Item label="Married" value="married" />
                            <Picker.Item label="Divorced" value="divorced" />
                            <Picker.Item label="Widowed" value="widowed" />
                        </Picker>
                    </View>
                </View>

                <Text style={styles.label}>Alternate Mobile Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Alternate Mobile Number"
                    keyboardType="numeric"
                    maxLength={10}
                    value={String(data.alternate_mobile_number)}
                    onChangeText={(value) => setData({ ...data, alternate_mobile_number: value })}
                    editable={editable}
                />

                <Text style={styles.sectionTitle}>Patient's Address</Text>

                <Text style={styles.label}>House No, Road or Street</Text>
                <TextInput
                    style={styles.input}
                    placeholder="House No, Road or Street"
                    value={data.p_house_no}
                    onChangeText={(value) => setData({ ...data, p_house_no: value })}
                    editable={editable}
                />
                <View style={styles.row}>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>Locality</Text>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="Locality"
                            value={data.p_locality}
                            onChangeText={(value) => setData({ ...data, p_locality: value })}
                            editable={editable}
                        />
                    </View>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>Pincode</Text>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="Pincode"
                            keyboardType="numeric"
                            maxLength={6}
                            value={data.p_pin_code}
                            onChangeText={(value) => setData({ ...data, p_pin_code: value })}
                            editable={editable}
                        />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>City</Text>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="City"
                            value={data.p_city}
                            onChangeText={(value) => setData({ ...data, p_city: value })}
                            editable={editable}
                        />
                    </View>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>District</Text>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="District"
                            value={data.p_district}
                            onChangeText={(value) => setData({ ...data, p_district: value })}
                            editable={editable}
                        />
                    </View>
                </View>
                <Text style={styles.label}>State</Text>
                <TextInput
                    style={styles.input}
                    placeholder="State"
                    value={data.p_state}
                    onChangeText={(value) => setData({ ...data, p_state: value })}
                    editable={editable}
                />

                <Text style={styles.sectionTitle}>Care Giver's Details</Text>
                <View style={styles.row}>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="First Name"
                            value={data.care_giver_first_name}
                            onChangeText={(value) => setData({ ...data, care_giver_first_name: value })}
                            editable={editable}
                        />
                    </View>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="Last Name"
                            value={data.care_giver_last_name}
                            onChangeText={(value) => setData({ ...data, care_giver_last_name: value })}
                            editable={editable}
                        />
                    </View>
                </View>
                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Mobile Number"
                    keyboardType="numeric"
                    maxLength={10}
                    value={String(data.care_giver_mobile_number)}
                    onChangeText={(value) => setData({ ...data, care_giver_mobile_number: value })}
                    editable={editable}
                />
                <Text style={styles.label}>Relationship with Care Giver</Text>
                <View style={styles.kpicker}>
                    <Picker
                        selectedValue={data.care_giver_relation}
                        onValueChange={(itemValue) => setData({ ...data, care_giver_relation: itemValue })}
                        enabled={editable}
                    >
                        <Picker.Item label="Relationship with Care Giver" value="" />
                        <Picker.Item label="Spouse" value="spouse" />
                        <Picker.Item label="Son" value="son" />
                        <Picker.Item label="Daughter" value="daughter" />
                        <Picker.Item label="Cousin" value="cousin" />
                        <Picker.Item label="Brother-in-law" value="brotherInLaw" />
                        <Picker.Item label="Sister-in-law" value="sisterInLaw" />
                        <Picker.Item label="Father" value="father" />
                        <Picker.Item label="Mother" value="mother" />
                        <Picker.Item label="Brother" value="brother" />
                        <Picker.Item label="Sister" value="sister" />
                        <Picker.Item label="Friend" value="friend" />
                        <Picker.Item label="Other" value="other" />
                    </Picker>
                </View>

                <Text style={styles.sectionTitle}>Kin's Details</Text>
                <View style={styles.row}>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="First Name"
                            value={data.Kin_First_name}
                            onChangeText={(value) => setData({ ...data, Kin_First_name: value })}
                            editable={editable}
                        />
                    </View>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="Last Name"
                            value={data.Kin_Last_name}
                            onChangeText={(value) => setData({ ...data, Kin_Last_name: value })}
                            editable={editable}
                        />
                    </View>
                </View>
                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Mobile Number"
                    keyboardType="numeric"
                    maxLength={10}
                    value={String(data.Kin_mobile_number)}
                    onChangeText={(value) => setData({ ...data, Kin_mobile_number: value })}
                    editable={editable}
                />
                <Text style={styles.label}>House No, Road or Street</Text>
                <TextInput
                    style={styles.input}
                    placeholder="House No, Road or Street"
                    value={data.Kin_House_no}
                    onChangeText={(value) => setData({ ...data, Kin_House_no: value })}
                    editable={editable}
                />
                <View style={styles.row}>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>Locality</Text>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="Locality"
                            value={data.Kin_Locality}
                            onChangeText={(value) => setData({ ...data, Kin_Locality: value })}
                            editable={editable}
                        />
                    </View>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>Pincode</Text>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="Pincode"
                            keyboardType="numeric"
                            maxLength={6}
                            value={data.Kin_pin_code}
                            onChangeText={(value) => setData({ ...data, Kin_pin_code: value })}
                            editable={editable}
                        />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>City</Text>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="City"
                            value={data.Kin_city}
                            onChangeText={(value) => setData({ ...data, Kin_city: value })}
                            editable={editable}
                        />
                    </View>
                    <View style={styles.halfInputContainer}>
                        <Text style={styles.label}>District</Text>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="District"
                            value={data.Kin_district}
                            onChangeText={(value) => setData({ ...data, Kin_district: value })}
                            editable={editable}
                        />
                    </View>
                </View>
                <Text style={styles.label}>State</Text>
                <TextInput
                    style={styles.input}
                    placeholder="State"
                    value={data.Kin_state}
                    onChangeText={(value) => setData({ ...data, Kin_state: value })}
                    editable={editable}
                />
                <Text style={styles.label}>Relationship with Patient</Text>
                <View style={styles.kpicker}>
                    <Picker
                        selectedValue={data.Kin_relationship_with_patient}
                        onValueChange={(itemValue) => setData({ ...data, Kin_relationship_with_patient: itemValue })}
                        enabled={editable}
                    >
                        <Picker.Item label="Relationship with Patient" value="" />
                        <Picker.Item label="Spouse" value="spouse" />
                        <Picker.Item label="Son" value="son" />
                        <Picker.Item label="Daughter" value="daughter" />
                        <Picker.Item label="Cousin" value="cousin" />
                        <Picker.Item label="Brother-in-law" value="brotherInLaw" />
                        <Picker.Item label="Sister-in-law" value="sisterInLaw" />
                        <Picker.Item label="Father" value="father" />
                        <Picker.Item label="Mother" value="mother" />
                        <Picker.Item label="Brother" value="brother" />
                        <Picker.Item label="Sister" value="sister" />
                        <Picker.Item label="Friend" value="friend" />
                        <Picker.Item label="Other" value="other" />
                    </Picker>
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.submitButton} onPress={editable ? handleSave : () => setEditable(true)}>
                        <Text style={styles.submitButtonText}>{editable ? 'Save' : 'Edit'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.submitButton, styles.deleteButton]} onPress={handleDelete}>
                        <Text style={styles.submitButtonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Are you sure you want to delete?</Text>
                    <View style={styles.buttonContainer2}>
                    <TouchableOpacity
                        style={[styles.button, styles.buttonConfirm]}
                        onPress={handleConfirm}
                    >
                        <Text style={styles.textStyle}>Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.buttonCancel]}
                        onPress={handleCancel}
                    >
                        <Text style={styles.textStyle}>Cancel</Text>
                    </TouchableOpacity>
                    </View>
                </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#0198A5',
        marginVertical: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    sectionTitle: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        flex: 1,
    },
    halfInput: {
        flex: 1,
    },
    halfInputContainer: {
        flex: 1,
        marginVertical: 10,
    },
    radioContainer: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    datePicker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    picker: {
        height: 50,
    },
    footer: {
        padding: 20,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    submitButton: {
        backgroundColor: '#0198A5',
        borderRadius: 5,
        paddingVertical: 15,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    deleteButton: {
        backgroundColor: '#FF6347',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    kpicker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginTop: 20,
        width: '100%',
    },
    container2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      buttonContainer2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginHorizontal: 10,
      },
      buttonConfirm: {
        backgroundColor: '#2196F3',
      },
      buttonCancel: {
        backgroundColor: '#FF6347',
      },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
      },
});

export default Profile;
