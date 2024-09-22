import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, Platform, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BouncyCheckbox from "react-native-bouncy-checkbox";

const { width, height } = Dimensions.get('window');

type FormData = {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  dob: string;
  age: number;
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
};

type OtherFormData = {
  sameAddress: string;
  caregiverOrOther: string;
  otherFirstName: string;
  otherLastName: string;
  othermobileNumber: string;
  otherRelation: string;
  kinHouse: string;
  kinLocality: string;
  kinCity: string;
  kinDistrict: string;
  kinState: string;
  kinPincode: string;
  agreedToTerms: boolean; // New field to track agreement to terms
};

type MoreDetailsRouteProp = RouteProp<{ params: { formData: FormData } }, 'params'>;

const MoreDetails: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<MoreDetailsRouteProp>();
  const { formData } = route.params;

  const [otherFormData, setOtherFormData] = useState<OtherFormData>({
    sameAddress: '',
    caregiverOrOther: 'Same as Care giver',
    otherFirstName: '',
    otherLastName: '',
    othermobileNumber: '',
    otherRelation: '',
    kinHouse: '',
    kinLocality: '',
    kinCity: '',
    kinDistrict: '',
    kinState: '',
    kinPincode: '',
    agreedToTerms: false, // Initialize agreedToTerms to false
  });

  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [hideInputs, setHideInputs] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true); // Initially disable the submit button

  useEffect(() => {
    validateForm();
  }, [otherFormData]);

  const handleCheckboxChange = (newValue: boolean) => {
    setIsChecked(newValue);
    setHideInputs(newValue);
    handleChangeLocal('sameAddress', newValue ? 'true' : 'false');
    validateForm(); // Call validateForm to update button state
  };

  const handleChangeLocal = (name: keyof OtherFormData, value: string | boolean) => {
    setOtherFormData((prev) => ({ ...prev, [name]: value }));
    validateForm(); // Validate form each time input changes
  };

  const validateForm = () => {
    // Mandatory fields if not using the same address
    const mandatoryFields = hideInputs
        ? []
        : ['kinHouse', 'kinLocality', 'kinCity', 'kinDistrict', 'kinState', 'kinPincode'];

    // Check if all mandatory fields are filled
    const missingFields = mandatoryFields.filter((field) => {
      const value = otherFormData[field as keyof OtherFormData];
      return typeof value === 'string' ? value.trim() === '' : false;
    });

    // Check if terms and conditions are agreed to
    const allValid = missingFields.length === 0 && otherFormData.agreedToTerms;
    setIsDisabled(!allValid);
  };

  const showAlert = (message: string) => {
    Alert.alert("Validation Error", message);
  };

  const registerFormSubmit = () => {
    if (isDisabled) {
      showAlert("Please complete all mandatory fields and agree to the terms and conditions.");
      return;
    }

    fetch('https://api.shrinkhala.in/patient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number: formData.mobileNumber,
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: formData.dob,
        age: formData.age,
        gender: formData.gender,
        marital_status: formData.maritalStatus,
        alternate_mobile_number: formData.alternateNumber,
        p_house_no: formData.house,
        p_locality: formData.locality,
        p_pin_code: formData.pincode,
        p_state: formData.state,
        p_city: formData.city,
        p_district: formData.district,
        address: `${formData.house} ${formData.locality} ${formData.state} ${formData.city} ${formData.district}`,
        care_giver_first_name: formData.careFirstName,
        care_giver_last_name: formData.careLastName,
        care_giver_mobile_number: formData.careMobNo,
        care_giver_relation: formData.careRelation,
        same_address: otherFormData.sameAddress,
        Kin_First_name: otherFormData.otherFirstName,
        Kin_Last_name: otherFormData.otherLastName,
        Kin_mobile_number: otherFormData.othermobileNumber,
        Kin_relationship_with_patient: otherFormData.otherRelation,
        care_giver_or_other: otherFormData.caregiverOrOther,
        Kin_House_no: otherFormData.kinHouse,
        Kin_Locality: otherFormData.kinLocality,
        Kin_pin_code: otherFormData.kinPincode,
        Kin_state: otherFormData.kinState,
        Kin_city: otherFormData.kinCity,
        Kin_district: otherFormData.kinDistrict,
      }),
    })
        .then((response) => {
          if (!response.ok) {
            throw new Error(JSON.stringify(response));
          }
          return response.json();
        })
        .then((data) => {
          AsyncStorage.setItem('userName', data.userName);
          navigation.navigate('FirstPasswordCreation');
        })
        .catch((error) => {
          Alert.alert('Error', 'There was a problem with the request: ' + error.message);
        });
  };

  return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 150 }}>
          <Text style={styles.subtitle}>Please share your Kin's detail.</Text>
          <Text style={styles.sectionTitle}>Patient's Next of Kin</Text>

          <View style={styles.radioGroup}>
            <View style={styles.radioButton}>
              <RadioButton
                  value="Same as Care giver"
                  status={otherFormData.caregiverOrOther === 'Same as Care giver' ? 'checked' : 'unchecked'}
                  onPress={() => handleChangeLocal('caregiverOrOther', 'Same as Care giver')}
                  color="#0198A5"
              />
              <Text>Same as Care giver</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton
                  value="Other"
                  status={otherFormData.caregiverOrOther === 'Other' ? 'checked' : 'unchecked'}
                  onPress={() => handleChangeLocal('caregiverOrOther', 'Other')}
                  color="#0198A5"
              />
              <Text>Other</Text>
            </View>
          </View>

          {/* Kin's Details */}
          {otherFormData.caregiverOrOther === 'Other' && (
              <>
                <Text style={styles.sectionTitle}>Kin's Details</Text>
                <View style={styles.inputGroup}>
                  <TextInput
                      style={[styles.input, styles.halfWidth]}
                      placeholder="First Name"
                      value={otherFormData.otherFirstName}
                      onChangeText={(value) => handleChangeLocal('otherFirstName', value)}
                  />
                  <TextInput
                      style={[styles.input, styles.halfWidth]}
                      placeholder="Last Name"
                      value={otherFormData.otherLastName}
                      onChangeText={(value) => handleChangeLocal('otherLastName', value)}
                  />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Mobile Number"
                    keyboardType="numeric"
                    maxLength={10}
                    value={otherFormData.othermobileNumber}
                    onChangeText={(value) => handleChangeLocal('othermobileNumber', value)}
                />
                <View style={styles.picker}>
                  <Picker
                      selectedValue={otherFormData.otherRelation}
                      onValueChange={(itemValue) => handleChangeLocal('otherRelation', itemValue)}
                  >
                    <Picker.Item label="Relationship with Kin" value="" />
                    <Picker.Item label="Spouse" value="spouse" />
                    <Picker.Item label="Son" value="son" />
                    <Picker.Item label="Daughter" value="daughter" />
                    <Picker.Item label="Father" value="father" />
                    <Picker.Item label="Mother" value="mother" />
                    <Picker.Item label="Brother" value="brother" />
                    <Picker.Item label="Sister" value="sister" />
                    <Picker.Item label="Other" value="other" />
                  </Picker>
                </View>
              </>
          )}

          {/* Kin's Address */}
          <Text style={styles.sectionTitle}>Kin's Address</Text>
          <View style={styles.checkboxContainer}>
            <Text style={styles.checkboxLabel}>Same as Patient</Text>
            <BouncyCheckbox fillColor="#0198A5" onPress={handleCheckboxChange} />
          </View>

          {!hideInputs && (
              <>
                <TextInput style={styles.input} placeholder="House/Flat Number" value={otherFormData.kinHouse} onChangeText={(value) => handleChangeLocal('kinHouse', value)} />
                <TextInput style={styles.input} placeholder="Locality" value={otherFormData.kinLocality} onChangeText={(value) => handleChangeLocal('kinLocality', value)} />
                <View style={styles.inputGroup}>
                  <TextInput style={[styles.input, styles.halfWidth]} placeholder="City" value={otherFormData.kinCity} onChangeText={(value) => handleChangeLocal('kinCity', value)} />
                  <TextInput style={[styles.input, styles.halfWidth]} placeholder="District" value={otherFormData.kinDistrict} onChangeText={(value) => handleChangeLocal('kinDistrict', value)} />
                </View>
                <View style={styles.inputGroup}>
                  <TextInput style={[styles.input, styles.halfWidth]} placeholder="State" value={otherFormData.kinState} onChangeText={(value) => handleChangeLocal('kinState', value)} />
                  <TextInput style={[styles.input, styles.halfWidth]} placeholder="Pincode" value={otherFormData.kinPincode} keyboardType="numeric" maxLength={6} onChangeText={(value) => handleChangeLocal('kinPincode', value)} />
                </View>
              </>
          )}

          {/* Terms and Conditions Checkbox */}
          <View style={styles.checkboxContainer}>
            <BouncyCheckbox
                fillColor="#0198A5"
                size={25}
                onPress={(isChecked: boolean) => {
                  handleChangeLocal('agreedToTerms', isChecked);
                  validateForm(); // Validate form whenever this is updated
                }}
                iconStyle={{ borderColor: "#0198A5", borderRadius: 4 }}
                textComponent={
                  <View style={styles.termsContainer}>
                    <Text style={styles.checkboxLabel}>I agree to the </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('TermsandConditions')}>
                      <Text style={styles.termsText}>Terms and Conditions</Text>
                    </TouchableOpacity>
                  </View>
                }
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
              style={[styles.submitButton, isDisabled && styles.disabledButton]}
              onPress={registerFormSubmit}
              disabled={isDisabled}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '5%',
    backgroundColor: 'white',
  },
  subtitle: {
    fontSize: width > 600 ? 20 : 16,
    fontWeight: 'bold',
    marginBottom: '5%',
  },
  sectionTitle: {
    fontSize: width > 600 ? 18 : 16,
    fontWeight: 'bold',
    marginTop: '5%',
    marginBottom: '2%',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    padding: width > 600 ? 12 : 10,
    marginVertical: '2%',
    fontSize: width > 600 ? 16 : 14,
    backgroundColor: '#f9f9f9',
    width: '100%',
  },
  halfWidth: {
    width: '48%',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    marginVertical: '2%',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: '3%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: width > 600 ? 16 : 14,
    color: '#0198A5',
  },
  termsText: {
    fontSize: width > 600 ? 16 : 14,
    color: '#0198A5',
    textDecorationLine: 'underline',
  },
  footer: {
    paddingHorizontal: '5%',
    paddingVertical: '2%',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: Platform.OS === 'ios' ? '10%' : '5%',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#0198A5',
    paddingVertical: height > 800 ? 16 : 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#d3d3d3',
  },
  submitButtonText: {
    color: 'white',
    fontSize: width > 600 ? 18 : 16,
    fontWeight: 'bold',
  },
});

export default MoreDetails;
