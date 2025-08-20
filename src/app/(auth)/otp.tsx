import { Stack, useLocalSearchParams } from "expo-router";
import OtpScreen from "../components/common/otp-screen";

const OTP = () => {
  const { mobile } = useLocalSearchParams();
  console.log(mobile, "mobileno");
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <OtpScreen mobile={mobile as string} />
    </>
  );
};

export default OTP;
