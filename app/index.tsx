import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import StudentForm from 'components/student-form';
import { StudentData } from 'types';
import { router } from 'expo-router';

export default function App() {
  const [studentData, setStudentData] = useState({
    studentName: '',
    enrollementNo: '',
    section: '',
    semester: '',
    disabled: false,
  });

  const handleFormSubmit = (
    values: StudentData,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    // Handle form submission
    console.log('Form submitted:', values);
    router.push(`/qr-code?student=${encodeURIComponent(JSON.stringify(values))}`);
    setSubmitting(true);
  };

  return (
    <>
      {/*  reduce padding if needed */}
      <SafeAreaView className="flex-1">
        <StudentForm
          studentData={{ ...studentData, disabled: false }}
          callback={handleFormSubmit}
        />
      </SafeAreaView>
    </>
  );
}
