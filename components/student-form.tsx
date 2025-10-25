import React, { useState } from 'react';
import { Formik } from 'formik';
import { Text, TextInput, View, TouchableOpacity, Image, Button } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { StudentData } from 'types';
import { router } from 'expo-router';

interface StudentDataProps {
  studentData: StudentData;
  callback: (values: StudentData, setSubmitting: (isSubmitting: boolean) => void) => void;
}

const StudentForm = ({ studentData, callback }: StudentDataProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    // Request permission to access media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      // mediaTypes: ImagePicker.MediaTypeOptions.Images,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  //
  return (
    <SafeAreaView
      style={{
        // lift the whole card a bit and add a soft shadow to create a "levitating" look

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 14,
        transform: [{ translateY: -6 }],
      }}>
      <View className="m-5 mt-20 items-center justify-center  rounded-3xl bg-white p-6">
        {!studentData.disabled && (
          <TouchableOpacity
            onPress={() => router.push('/submit-attendance')}
            className="self-end pb-5">
            <Text className="text-gray-400 underline">Skip</Text>
          </TouchableOpacity>
        )}
        <View className="items-center justify-center ">
          <Text
            style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}
            className="mb-[20px] text-[20px] font-bold">
            Complete Your Profile
          </Text>

          {/* student picture */}
          <TouchableOpacity
            disabled={studentData.disabled}
            className="mb-10 h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gray-300"
            onPress={pickImage}
            style={{
              // subtle individual bubble shadow and small lift for the avatar
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.14,
              shadowRadius: 8,
              elevation: 8,
              transform: [{ translateY: -4 }],
            }}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} className="h-full w-full" />
            ) : (
              <Text className="text-center text-sm text-gray-600">📷{'\n'}Add Photo</Text>
            )}
          </TouchableOpacity>
        </View>
        {/* Formik Form */}
        <Formik
          initialValues={studentData}
          validate={(values) => {
            const errors: any = {};
            if (!values.studentName) {
              errors.studentName = 'Student name is required';
            }
            if (!values.enrollementNo) {
              errors.enrollementNo = 'Enrollment number is required';
            }
            if (!values.section) {
              errors.section = 'Section is required';
            }
            if (!values.semester) {
              errors.semester = 'Semester is required';
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            callback(values, setSubmitting);
            setSubmitting(false);
          }}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          }) => (
            <View style={{ width: '80%' }}>
              <TextInput
                editable={!studentData.disabled}
                placeholder="Student Name"
                placeholderTextColor={'#000'}
                onChangeText={handleChange('studentName')}
                onBlur={handleBlur('studentName')}
                value={values.studentName}
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  padding: 10,
                  marginBottom: 5,
                  borderRadius: 5,
                  backgroundColor: '#fff',
                  // slight inner shadow to keep elevated visual consistent
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.04,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              />
              {errors.studentName && touched.studentName && (
                <Text style={{ color: 'red', marginBottom: 5 }}>{errors.studentName}</Text>
              )}
              <TextInput
                editable={!studentData.disabled}
                placeholderTextColor={'#000'}
                placeholder="Enrollment Number"
                onChangeText={handleChange('enrollementNo')}
                onBlur={handleBlur('enrollementNo')}
                value={values.enrollementNo}
                inputMode="numeric"
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  padding: 10,
                  marginBottom: 5,
                  borderRadius: 5,
                  backgroundColor: '#fff',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.04,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              />
              {errors.enrollementNo && touched.enrollementNo && (
                <Text style={{ color: 'red', marginBottom: 5 }}>{errors.enrollementNo}</Text>
              )}

              {/* Section Picker */}

              <RNPickerSelect
                disabled={studentData.disabled}
                onValueChange={(value) => setFieldValue('section', value)}
                items={[
                  { label: 'Section A', value: 'A' },
                  { label: 'Section B', value: 'B' },
                  { label: 'Section C', value: 'C' },
                ]}
                value={values.section}
                placeholder={{
                  label: 'Select a section...',
                  value: null,
                }}
                useNativeAndroidPickerStyle={false}
                textInputProps={{
                  underlineColorAndroid: '',
                }}
                Icon={() => {
                  return <Text style={{ fontSize: 12, color: '#666', paddingRight: 10 }}>▼</Text>;
                }}
                style={{
                  inputIOS: {
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    marginBottom: 5,
                    borderRadius: 5,
                    backgroundColor: '#fff',
                    fontSize: 16,
                    color: 'black',
                    paddingRight: 30,
                  },
                  inputAndroid: {
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    marginBottom: 5,
                    borderRadius: 5,
                    backgroundColor: '#fff',
                    fontSize: 16,
                    color: 'black',
                    paddingRight: 30,
                  },
                  iconContainer: {
                    top: 15,
                    right: 10,
                  },
                }}
              />
              {errors.section && touched.section && (
                <Text style={{ color: 'red', marginBottom: 5 }}>{errors.section}</Text>
              )}

              {/* Semester Picker */}
              <RNPickerSelect
                disabled={studentData.disabled}
                onValueChange={(value) => setFieldValue('semester', value)}
                items={[
                  { label: 'Semester 1', value: '1' },
                  { label: 'Semester 2', value: '2' },
                  { label: 'Semester 3', value: '3' },
                  { label: 'Semester 4', value: '4' },
                  { label: 'Semester 5', value: '5' },
                  { label: 'Semester 6', value: '6' },
                  { label: 'Semester 7', value: '7' },
                  { label: 'Semester 8', value: '8' },
                ]}
                value={values.semester}
                placeholder={{
                  label: 'Select a semester...',
                  value: null,
                  color: '#9EA0A4',
                }}
                useNativeAndroidPickerStyle={false}
                textInputProps={{
                  underlineColorAndroid: 'transparent',
                }}
                Icon={() => {
                  return <Text style={{ fontSize: 12, color: '#666', paddingRight: 10 }}>▼</Text>;
                }}
                style={{
                  inputIOS: {
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    marginBottom: 5,
                    borderRadius: 5,
                    backgroundColor: '#fff',
                    fontSize: 16,
                    color: 'black',
                    paddingRight: 30,
                  },
                  inputAndroid: {
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    marginBottom: 5,
                    borderRadius: 5,
                    backgroundColor: '#fff',
                    fontSize: 16,
                    color: 'black',
                    paddingRight: 30,
                  },
                  iconContainer: {
                    top: 15,
                    right: 10,
                  },
                }}
              />
              {errors.semester && touched.semester && (
                <Text style={{ color: 'red', marginBottom: 5 }}>{errors.semester}</Text>
              )}

              <Button
                onPress={() => handleSubmit()}
                title={values.disabled ? 'Submit your Attendance' : 'Save Profile'}
                //   disabled={isSubmitting || studentData.disabled}
                disabled={values.disabled && isSubmitting}
              />
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default StudentForm;
