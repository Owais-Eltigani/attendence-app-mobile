import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Button, Text, TextInput, View, TouchableOpacity, Image } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [studentData, setStudentData] = useState(null);
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
  return (
    <>
      {/*  reduce padding if needed */}
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 4 }}>
        <View className="flex-1 items-center justify-center">
          <Text
            style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}
            className="mb-[20px] text-[20px] font-bold">
            Complete Your Profile
          </Text>

          {/* student picture */}
          <TouchableOpacity
            className="mb-10 h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gray-300"
            onPress={pickImage}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} className="h-full w-full" />
            ) : (
              <Text className="text-center text-sm text-gray-600">📷{'\n'}Add Photo</Text>
            )}
          </TouchableOpacity>
          <Formik
            initialValues={{
              studentName: '',
              enrollementNo: '',
              section: '',
              semester: '',
              editing: true,
            }}
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
              console.log('Form submitted:', values);
              // Handle form submission here
              setTimeout(() => {
                setSubmitting(false);

                const student = {
                  name: values.studentName,
                  enrNo: values.enrollementNo,
                  section: values.section,
                  semester: values.semester,
                };

                // Serialize the student object as JSON string
                router.push(`/qr-code?student=${encodeURIComponent(JSON.stringify(student))}`);
              }, 400);
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
                  }}
                />
                {errors.studentName && touched.studentName && (
                  <Text style={{ color: 'red', marginBottom: 5 }}>{errors.studentName}</Text>
                )}
                <TextInput
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
                  }}
                />
                {errors.enrollementNo && touched.enrollementNo && (
                  <Text style={{ color: 'red', marginBottom: 5 }}>{errors.enrollementNo}</Text>
                )}

                {/* Section Picker */}
                <RNPickerSelect
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
                    // color: '#9EA0A4',
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
                      paddingRight: 30, // to ensure the text is never behind the icon
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
                      paddingRight: 30, // to ensure the text is never behind the icon
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
                      paddingRight: 30, // to ensure the text is never behind the icon
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
                      paddingRight: 30, // to ensure the text is never behind the icon
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
                <Button onPress={() => handleSubmit()} title="Submit" disabled={isSubmitting} />
              </View>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    </>
  );
}
