import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BouncyCheckbox from "react-native-bouncy-checkbox";

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
  sameAddress: string,
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
};

type MoreDetailsRouteProp = RouteProp<{ params: { formData: FormData } }, 'params'>;

const MoreDetails: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<MoreDetailsRouteProp>();
  const { formData } = route.params;

  useEffect(() => {
    console.log("formdata---", formData);
  }, []);

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
  });

  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [hideInputs, setHideInputs] = useState<boolean>(false);

  const handleCheckboxChange = (newValue: boolean) => {
    setIsChecked(newValue);
    console.log(newValue+"---");
    
    if(newValue) {
      setHideInputs(true);
      handleChangeLocal('sameAddress','true');
    }
    else if(!newValue) {
      setHideInputs(false);
      handleChangeLocal('sameAddress','false');
    }
    // disableCheck();
  };

  const handleChangeLocal = (name: keyof OtherFormData, value: string) => {
    setOtherFormData((prev) => ({ ...prev, [name]: value }));
  };

  const backButtonHandler = () => {
    navigation.navigate('RegistrationForm');
  };

  const disableCheck = () => {
    setIsDisabled(
      !isChecked || otherFormData.caregiverOrOther === 'Same as Care giver' ||
      otherFormData.kinHouse.trim() === '' ||
      otherFormData.kinLocality.trim() === '' ||
      otherFormData.kinCity.trim() === '' ||
      otherFormData.kinState.trim() === '' ||
      otherFormData.kinPincode.trim() === ''
    );
  };

  const registerFormSubmit = () => {
    const fullName = `${formData.firstName} ${formData.lastName}`;
    AsyncStorage.setItem('fullName', fullName);
    console.log("other form details-", otherFormData);

    fetch('https://api.shrinkhala.in/patient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
        Kin_district: otherFormData.kinDistrict
      }),
      referrerPolicy: 'strict-origin-when-cross-origin'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        AsyncStorage.setItem('userName', data.userName);
        navigation.navigate('FirstPasswordCreation');
      })
      .catch(error => {
        console.error('There was a problem with the login request:', error);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shrinkhala</Text>
      </View>
      <Text style={styles.subtitle}>Please share more details</Text>
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

      {otherFormData.caregiverOrOther === 'Other' && (
        <View>
          <Text style={styles.sectionTitle}>Kin's Details</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, styles.halfWidth]}
              placeholder="   First Name"
              value={otherFormData.otherFirstName}
              onChangeText={(value) => handleChangeLocal('otherFirstName', value)}
            />
            <TextInput
              style={[styles.input, styles.halfWidth]}
              placeholder="   Last Name"
              value={otherFormData.otherLastName}
              onChangeText={(value) => handleChangeLocal('otherLastName', value)}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="   Mobile Number"
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
              <Picker.Item style={{ color: 'grey' }} label="Relationship with Kin" value="" />
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
        </View>
      )}

      <Text style={styles.sectionTitle}>Kin's Address</Text>
      <View style={styles.checkboxContainer}>
        {/* <CheckBox
          value={isChecked}
          onValueChange={handleCheckboxChange}
        /> */}
        {/*<BouncyCheckbox fillColor="#0198A5" onPress={(isChecked: boolean) => {handleCheckboxChange(isChecked)}} />*/}
        <Text style={styles.checkboxLabel}>Same as Patient</Text>
        <BouncyCheckbox fillColor="#0198A5" onPress={(isChecked: boolean) => {handleCheckboxChange(isChecked)}} />

      </View>
      {!hideInputs&&(
        <>
        <View>
          <TextInput
            style={[styles.input]}
            placeholder="   House/Flat Number"
            value={otherFormData.kinHouse}
            onChangeText={(value) => handleChangeLocal('kinHouse', value)}
          />
          <TextInput
            style={[styles.input]}
            placeholder="   Locality"
            value={otherFormData.kinLocality}
            onChangeText={(value) => handleChangeLocal('kinLocality', value)}
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.input, styles.halfWidth]}
            placeholder="   City"
            value={otherFormData.kinCity}
            onChangeText={(value) => handleChangeLocal('kinCity', value)}
          />
          <TextInput
            style={[styles.input, styles.halfWidth]}
            placeholder="   District"
            value={otherFormData.kinDistrict}
            onChangeText={(value) => handleChangeLocal('kinDistrict', value)}
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.input, styles.halfWidth]}
            placeholder="   State"
            value={otherFormData.kinState}
            onChangeText={(value) => handleChangeLocal('kinState', value)}
          />
          <TextInput
            style={[styles.input, styles.halfWidth]}
            placeholder="   Pincode"
            value={otherFormData.kinPincode}
            keyboardType="numeric"
            maxLength={6}
            onChangeText={(value) => handleChangeLocal('kinPincode', value)}
          />
        </View>
      </>
)}
      <View style={styles.checkboxContainer}>
        {/* <CheckBox
          value={isChecked}
          onValueChange={handleCheckboxChange}
        /> */}
        <Text style={styles.checkboxLabel}>I agree to the Terms and Conditions</Text>
        <BouncyCheckbox fillColor="#0198A5" onPress={(isChecked: boolean) => {}} />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isDisabled && styles.disabledButton]}
        onPress={registerFormSubmit}
        disabled={isDisabled}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {/*<TouchableOpacity onPress={backButtonHandler}>*/}
      {/*  <Text style={styles.laterText}>Do it later</Text>*/}
      {/*</TouchableOpacity>*/}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backImage: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    color: '#0198A5',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 18,
  },
  radioGroup: {
    flexDirection: 'row',
    marginTop: 4,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 25,
    padding: 8,
    marginTop: 8,
    width: '100%',
  },
  halfWidth: {
    width: '48%',
  },
  picker: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 25,
    marginTop: 10,
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
  },
  checkboxLabel: {
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 4,
    color: '#0198A5',
  },
  submitButton: {
    backgroundColor: '#0198A5',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#d3d3d3',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
  laterText: {
    color: '#0198A5',
    textAlign: 'center',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
});

export default MoreDetails;
