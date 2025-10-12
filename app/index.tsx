import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { Button, Text, TextInput, View } from 'react-native';

export default function App() {
  return (
    <>
      {/*  reduce padding if needed */}
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 4 }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className="bg-blue-500">
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
            Complete Your Profile
          </Text>
          <Formik
            initialValues={{
              studentName: '',
              enrollementNo: '',
              section: '',
              semester: '',
            }}
            validate={(values) => {
              const errors: { studentName?: string; enrollementNo?: string } = {};
              if (!values.studentName) {
                errors.studentName = 'Required';
              }
              if (!values.enrollementNo) {
                errors.enrollementNo = 'Required';
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
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
                  placeholder="Enr No"
                  onChangeText={handleChange('enrollementNo')}
                  onBlur={handleBlur('enrollementNo')}
                  value={values.enrollementNo}
                  secureTextEntry
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

                {/* extra fields */}
                <TextInput
                  placeholderTextColor={'#000'}
                  placeholder="Section"
                  onChangeText={handleChange('section')}
                  onBlur={handleBlur('section')}
                  value={values.section}
                  secureTextEntry
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    marginBottom: 5,
                    borderRadius: 5,
                    backgroundColor: '#fff',
                  }}
                />
                {errors.section && touched.section && (
                  <Text style={{ color: 'red', marginBottom: 5 }}>{errors.section}</Text>
                )}
                <TextInput
                  placeholderTextColor={'#000'}
                  placeholder="Semester"
                  onChangeText={handleChange('semester')}
                  onBlur={handleBlur('semester')}
                  value={values.semester}
                  secureTextEntry
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
                <Button
                  onPress={() => router.push('/(tabs)/qr-code')}
                  title="Submit"
                  disabled={isSubmitting}
                />
              </View>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    </>
  );
}

/* 
<StatusBar style="auto" />
        <View className="flex-1 items-center justify-center bg-gray-500">
          <Text className="text-white">Hello, World!</Text>
        </View>
*/
