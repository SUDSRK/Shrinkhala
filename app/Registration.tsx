import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {Alert} from "react-native";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RadioButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Define the props interface
interface RegistrationFormProps {
//   phoneNumber: string;
  patientDetails: any; // Replace 'any' with appropriate type if available
  setPatientDetails: React.Dispatch<React.SetStateAction<any>>;
}

// Define the state interface
interface FormData {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  patientOrCaregiver: string;
  dob: string;
  age: string;
  gender: string;
  maritalStatus: string;
  alternateNumber: string;
  house: string;
  locality: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  careFirstName: string;
  careLastName: string;
  careMobNo: string;
  careRelation: string;
}

const Registration: React.FC<RegistrationFormProps> = () => {
    const router = useRouter();
    const route = useRoute();
    const { phoneNumber } = route.params as { phoneNumber: string };
  const navigation = useNavigation<NavigationProp<any>>();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    mobileNumber: phoneNumber,
    patientOrCaregiver: '',
    dob: '',
    age: '',
    gender: '',
    maritalStatus: '',
    alternateNumber: '',
    house: '',
    locality: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    careFirstName: '',
    careLastName: '',
    careMobNo: '',
    careRelation: '',
  });

  const [date, setDate] = useState<Date>(new Date());
  const [show, setShow] = useState<boolean>(false);

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (formData.patientOrCaregiver === 'patient') {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [formData.patientOrCaregiver]);

  const handleChange = (name: keyof FormData, value: string) => {
    const newFormData = name === 'dob'
      ? { ...formData, [name]: value, age: calculateAge(value) }
      : { ...formData, [name]: value };
    setFormData(newFormData);
  };

  const calculateAge = (dob: string): string => {
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const dobMonth = dobDate.getMonth();
    const todayMonth = today.getMonth();

    if (todayMonth < dobMonth || (todayMonth === dobMonth && today.getDate() < dobDate.getDate())) {
      age--;
    }

    return age.toString();
  };

    const registerFormSubmit = async () => {
      const requiredFields: { field: keyof FormData; label: string }[] = [
        { field: 'firstName', label: "First Name" },
        { field: 'lastName', label: "Last Name" },
        { field: 'mobileNumber', label: "Mobile Number" },
        { field: 'patientOrCaregiver', label: "Patient or Caregiver Selection" },
        { field: 'dob', label: "Date of Birth" },
        { field: 'age', label: "Age" },
        { field: 'gender', label: "Gender" },
        { field: 'maritalStatus', label: "Marital Status" },
        { field: 'alternateNumber', label: "Alternate Mobile Number" },
        { field: 'house', label: "House No, Road or Street" },
        { field: 'locality', label: "Locality" },
        { field: 'city', label: "City" },
        { field: 'district', label: "District" },
        { field: 'state', label: "State" },
        { field: 'pincode', label: "Pincode" },
        { field: 'careFirstName', label: "Caregiver First Name" },
        { field: 'careLastName', label: "Caregiver Last Name" },
        { field: 'careMobNo', label: "Caregiver Mobile Number" },
        { field: 'careRelation', label: "Caregiver Relationship" }
      ];

      for (const field of requiredFields) {
        if (!formData[field.field]) {
          Alert.alert("Validation Error", `The ${field.label} field is mandatory.`);
          return;
        }
      }
      await AsyncStorage.setItem('patientData', JSON.stringify(formData));
    await AsyncStorage.setItem('phoneNumber', formData.mobileNumber);
    navigation.navigate('MoreDetails', { formData });
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    handleChange('dob', currentDate.toISOString().split('T')[0]);
  };

  const onDateChangeWeb = (selectedDate: Date) => {
    setDate(selectedDate);
    handleChange('dob', selectedDate.toISOString().split('T')[0]);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welcome to Shrinkhala!</Text>
        <Text>Please fill up the mandatory details to continue</Text>
        <Text style={styles.sectionTitle}>Patient's Details</Text>
        <TextInput
          style={[styles.input, { color: 'grey' }]}
          placeholder="Mobile Number"
          keyboardType="numeric"
          maxLength={10}
          value={formData.mobileNumber}
          onChangeText={(value) => handleChange('mobileNumber', value)}
          editable={false}
        />
        <Text>Whom does this number belong to:</Text>
        <View style={styles.radioContainer}>
          <View style={styles.radioOption}>
            <RadioButton
              value="patient"
              status={formData.patientOrCaregiver === 'patient' ? 'checked' : 'unchecked'}
              onPress={() => handleChange('patientOrCaregiver', 'patient')}
              color="#0198A5"
            />
            <Text style={styles.radioText}>Patient</Text>
          </View>
          <View style={styles.radioOption}>
            <RadioButton
              value="caregiver"
              status={formData.patientOrCaregiver === 'Care Giver' ? 'checked' : 'unchecked'}
              onPress={() => handleChange('patientOrCaregiver', 'Care Giver')}
              color="#0198A5"
            />
            <Text style={styles.radioText}>Care Giver</Text>
          </View>
        </View>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput, styles.marginRight]}
            placeholder="First Name"
            value={formData.firstName}
            onChangeText={(value) => handleChange('firstName', value)}
          />
          <TextInput
            style={[styles.input, styles.halfInput, styles.marginLeft]}
            placeholder="Last Name"
            value={formData.lastName}
            onChangeText={(value) => handleChange('lastName', value)}
          />
        </View>
        <View style={styles.row}>
          {Platform.OS === 'web' ? (
            <DatePicker
              selected={date}
            //   onChange={onDateChangeWeb}
              dateFormat="yyyy-MM-dd"
              customInput={
                <TouchableOpacity onPress={showDatepicker} style={[styles.datePicker, styles.halfInput]}>
                  <Text>{formData.dob || 'Date of Birth'}</Text>
                </TouchableOpacity>
              }
            />
          ) : (
            <TouchableOpacity onPress={showDatepicker} style={[styles.datePicker, styles.halfInput, styles.marginRight]}>
              <Text>{formData.dob || 'Date of Birth'}</Text>
            </TouchableOpacity>
          )}
          {show && Platform.OS !== 'web' && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
          <TextInput
            style={[styles.input, styles.halfInput, styles.marginLeft]}
            placeholder="Age"
            value={formData.age}
            onChangeText={(value) => handleChange('age', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.row}>
          <View style={[styles.input, styles.halfInput, styles.marginRight]}>
            <Picker
              selectedValue={formData.gender}
              onValueChange={(value) => handleChange('gender', value)}
              style={styles.picker}
            >
              <Picker.Item style={{ color: 'grey' }} label="Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Others" value="others" />
            </Picker>
          </View>
          <View style={[styles.input, styles.halfInput, styles.marginLeft]}>
            <Picker
              selectedValue={formData.maritalStatus}
              onValueChange={(value) => handleChange('maritalStatus', value)}
              style={styles.picker}
            >
              <Picker.Item style={{ color: 'grey' }} label="Marital Status" value="" />
              <Picker.Item label="Single" value="single" />
              <Picker.Item label="Married" value="married" />
              <Picker.Item label="Divorced" value="divorced" />
              <Picker.Item label="Widowed" value="widowed" />
            </Picker>
          </View>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Alternate Mobile Number"
          keyboardType="numeric"
          maxLength={10}
          value={formData.alternateNumber}
          onChangeText={(value) => handleChange('alternateNumber', value)}
        />
        <Text style={{ fontSize: width * 0.04, fontWeight: 'bold', marginTop: 20 }}>Patient's Address</Text>
        <TextInput
          style={styles.input}
          placeholder="House No, Road or Street"
          value={formData.house}
          onChangeText={(value) => handleChange('house', value)}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput, styles.marginRight]}
            placeholder="Locality"
            value={formData.locality}
            onChangeText={(value) => handleChange('locality', value)}
          />
          <TextInput
            style={[styles.input, styles.halfInput, styles.marginLeft]}
            placeholder="Pincode"
            keyboardType="numeric"
            maxLength={6}
            value={formData.pincode}
            onChangeText={(value) => handleChange('pincode', value)}
          />
        </View>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput, styles.marginRight]}
            placeholder="City"
            value={formData.city}
            onChangeText={(value) => handleChange('city', value)}
          />
          <TextInput
            style={[styles.input, styles.halfInput, styles.marginLeft]}
            placeholder="District"
            value={formData.district}
            onChangeText={(value) => handleChange('district', value)}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="State"
          value={formData.state}
          onChangeText={(value) => handleChange('state', value)}
        />
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20 }}>Care Giver's Details</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput, styles.marginRight]}
            placeholder="First Name"
            value={formData.careFirstName}
            onChangeText={(value) => handleChange('careFirstName', value)}
          />
          <TextInput
            style={[styles.input, styles.halfInput, styles.marginLeft]}
            placeholder="Last Name"
            value={formData.careLastName}
            onChangeText={(value) => handleChange('careLastName', value)}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          keyboardType="numeric"
          maxLength={10}
          value={formData.careMobNo}
          onChangeText={(value) => handleChange('careMobNo', value)}
          editable={formData.patientOrCaregiver === 'patient'}
        />
        <View style={styles.kpicker}>
          <Picker
            selectedValue={formData.careRelation}
            onValueChange={(itemValue) => handleChange('careRelation', itemValue)}
          >
            <Picker.Item style={{ color: 'grey' }} label="Relationship with Care Giver" value="" />
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
        <TouchableOpacity style={styles.submitButton} onPress={registerFormSubmit}>
          <Text style={styles.submitButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: '5%', // Using percentage for responsiveness
    paddingBottom: '20%', // Adjust for bottom space especially on smaller screens
  },
  header: {
    fontSize: width > 600 ? 28 : 22, // Larger font for tablets
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0198A5',
    marginVertical: '5%',
  },
  title: {
    fontSize: width > 600 ? 20 : 16, // Adjust title size based on screen width
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: '4%',
  },
  sectionTitle: {
    marginTop: '5%',
    fontSize: width > 600 ? 20 : 16, // Responsive text size
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '2%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingVertical: width > 600 ? 15 : 10, // Adjust padding based on screen width
    paddingHorizontal: '5%',
    marginVertical: '2.5%',
    fontSize: width > 600 ? 18 : 14, // Adjust font size for inputs
    backgroundColor: '#f9f9f9',
    width: '100%',
  },
  radioContainer: {
    flexDirection: 'row',
    marginVertical: '2.5%',
    justifyContent: 'space-around',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioText: {
    marginLeft: 5,
    fontSize: width > 600 ? 16 : 14, // Adjust radio text size
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingVertical: width > 600 ? 15 : 10,
    paddingHorizontal: '5%',
    marginVertical: '2.5%',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: '2.5%',
    width: '100%', // Ensure full width of the row
  },
  halfInput: {
    flex: 1,
  },
  marginRight: {
    marginRight: '2.5%',
  },
  marginLeft: {
    marginLeft: '2.5%',
  },
  picker: {
    height: width > 600 ? 50 : 40, // Adjust picker height
    width: '100%',
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    marginVertical: '2.5%',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: '3%',
  },
  kpicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    marginVertical: '2.5%',
    paddingHorizontal: '5%',
    backgroundColor: '#f9f9f9',
  },
  footer: {
    paddingHorizontal: '5%',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: Platform.OS === 'ios' ? '10%' : '5%', // Adjust for iOS safe area
  },
  submitButton: {
    backgroundColor: '#0198A5',
    borderRadius: 25,
    paddingVertical: height > 800 ? 16 : 12, // Adjust padding for different screen heights
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: width > 600 ? 18 : 16, // Larger text on larger screens
    fontWeight: 'bold',
  },
  textFieldContainer: {
    paddingHorizontal: '5%',
    paddingVertical: '2%',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginVertical: '1%',
  },
});


export default Registration;
