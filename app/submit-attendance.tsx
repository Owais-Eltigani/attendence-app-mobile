import { View, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import StudentForm from 'components/student-form';
import { useSearchParams } from 'expo-router/build/hooks';

const Submit = () => {
  //   Alert.alert('Caution', 'Make sure you scanned the first QR code and connected to the Sessions');

  const studentData = useSearchParams().get('student');

  const SubmitStudentAttendance = async () => {
    const HOST = 'http://192.168.2.1:8080';

    await fetch(`${HOST}/submit-attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      //? use directly studentData if already serialized
      body: studentData,
    })
      .then((response) => response.json())
      .then((data) => {
        Alert.alert('Success', 'Attendance submitted successfully!');
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to submit attendance.');
        console.error('Error submitting attendance:', error);
      });
  };

  useEffect(() => {
    console.log('🚀 ~ Submit ~ SubmitStudentAttendance: trying to submit attendance');
    SubmitStudentAttendance();
  }, []);

  return (
    <SafeAreaView className="">
      <View className="">
        <StudentForm
          studentData={{
            studentName: 'Dexter',
            enrollementNo: '220160203019',
            section: 'A',
            semester: '7',
            disabled: true,
          }}
          callback={SubmitStudentAttendance}
        />
      </View>
    </SafeAreaView>
  );
};

export default Submit;
