import { View, Text, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import uuid from "react-native-uuid";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();

  const onSignUpPress = async () => {
    console.log("Pressed");

    if (!form.email || !form.password) {
      setErrorMessage("All fields are required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://hipaaschatbotbackend.onrender.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: form.email, password: form.password }),
        }
      );

      console.log("Response status:", response.status);
      const responseBody = await response.text(); // Read the response as text
      console.log("Response body:", responseBody);

      if (!response.ok) {
        const errorData = JSON.parse(responseBody);
        Alert.alert("Error", errorData.error);
        setIsLoading(false);
        return;
      }

      const data = JSON.parse(responseBody);
      dispatch(
        login({
          token: data.token,
          user: {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
          },
        })
      );
      // console.log("data: ", data);

      await AsyncStorage.setItem("token", data.token);

      Alert.alert("Success", "User Log in successfully!");
      // router.replace("/chatscreen");
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView className="w-full bg-white justify-center items-center">
      <View className="px-4 h-full w-full mt-10">
        <View className="w-full">
          <View className="flex-row items-center justify-center space-x-4">
            <Image
              source={images.icon}
              className="w-10 h-10"
              resizeMode="contain"
            />
            <Text className="text-black font-psemibold text-3xl">HiPaaS</Text>
          </View>

          <Text className="text-center mt-3 text-2xl font-pmedium">
            An AI Powered Chatbot
          </Text>

          <View className="w-full mt-20">
            <Text className="text-center font-pregular text-2xl my-4">
              Login To Continue
            </Text>
            {/* <Link href="/chatscreen">Chatscreen</Link> */}
          </View>
          <View className="w-full ">
            <FormField
              label="Email"
              placeholder="Enter your email"
              icon={icons.email}
              value={form.email}
              onChangeText={(value) => setForm({ ...form, email: value })}
            />
            <FormField
              label="Passoword"
              placeholder="Enter your password"
              icon={icons.lock}
              value={form.password}
              secureTextEntry
              onChangeText={(value) => setForm({ ...form, password: value })}
            />

            <CustomButton
              title="Sign Up"
              handlePress={onSignUpPress}
              containerStyle="mt-10"
              isLoading={isLoading}
            />
          </View>

          <Link
            href="/signup"
            className="text-lg text-center text-general-200 mt-10 font-pmedium"
          >
            <Text className="">Don't have an account ? </Text>
            <Text className="text-secondary underline">Register Here</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
