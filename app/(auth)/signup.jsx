import { View, Text, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();

  const onSignUpPress = async () => {
    console.log("Pressed");

    if (!form.email || !form.name || !form.password) {
      setErrorMessage("All fields are required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://hipaaschatbotbackend.onrender.com/adduser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
          }),
        }
      );

      console.log("Response status:", response.status);
      const responseBody = await response.text(); // Get the response body as raw text
      console.log("Response body:", responseBody);

      if (!response.ok) {
        const errorData = JSON.parse(responseBody);
        Alert.alert("Error", errorData.error);
        setIsLoading(false);
        return;
      }

      const data = JSON.parse(responseBody);
      console.log("Registration Data: ", data);

      dispatch(
        login({
          isLoggedIn: true,
          token: data.token,
          user: {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
          },
        })
      );
      await AsyncStorage.setItem("token", data.token);

      Alert.alert("Success", "User registered successfully!");
      router.replace("/chatscreen");
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      console.error("Registration error:", error);
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
              Register To Continue
            </Text>
          </View>
          <View className="w-full ">
            <FormField
              label="Name"
              placeholder="Enter your name"
              icon={icons.person}
              value={form.name}
              onChangeText={(value) => setForm({ ...form, name: value })}
            />
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
            {errorMessage && (
              <Text className="text-red-500 text-lg text-center">
                {errorMessage}
              </Text>
            )}

            <CustomButton
              title="Sign Up"
              handlePress={onSignUpPress}
              containerStyle="mt-10"
              isLoading={isLoading}
            />
          </View>

          <Link
            href="/signin"
            className="text-lg text-center text-general-200 mt-10 font-pmedium"
          >
            <Text className="">Already have an account ? </Text>
            <Text className="text-secondary underline">Log In</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
