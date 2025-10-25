import { View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StudentForm from 'components/student-form';
import { StudentData } from 'types';

const Submit = () => {
  //   Alert.alert('Caution', 'Make sure you scanned the first QR code and connected to the Sessions');

  const SubmitStudentAttendance = async (
    values: StudentData,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const HOST = 'http://192.168.2.1:8080';
    //

    // Logic to handle attendance submission
    console.log('submitting:', values);
    // Handle form submission here

    const now = new Date();
    const hours24 = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours24 >= 12 ? 'pm' : 'am';
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const submittedAt = `${hours12}:${minutes.toString().padStart(2, '0')} ${ampm}`;

    const student = {
      studentName: values.studentName,
      enrollmentNo: values.enrollementNo,
      sessionId: 'B-4623',
      section: values.section,
      submittedAt,
    };

    //? a way to timeout fetch requests after  3 seconds
    const controller = new AbortController();
    const REQUEST_TIMEOUT_MS = 3000; // timeout for the fetch itself
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    setTimeout(async () => {
      setSubmitting(true);
      await fetch(`${HOST}/submit-attendance`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },

        //? use directly studentData if already serialized
        body: encodeURIComponent(JSON.stringify(student)),
      })
        .then((response) => response.json())
        .then((data) => {
          Alert.alert('Success', 'Attendance submitted successfully!');
        })
        .catch((error) => {
          Alert.alert('Error', 'Failed to submit attendance.');
          console.error('Error submitting attendance:', error);
        });
    }, 3100); // Simulate a 3-second delay for submission
  };

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
