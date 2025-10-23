import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import StudentForm from 'components/student-form';

export default function App() {
  const [studentData, setStudentData] = useState({
    studentName: '',
    enrollementNo: '',
    section: '',
    semester: '',
    disabled: false,
  });
  return (
    <>
      {/*  reduce padding if needed */}
      <SafeAreaView className="flex-1">
        <StudentForm studentData={{ ...studentData, disabled: false }} />
      </SafeAreaView>
    </>
  );
}
