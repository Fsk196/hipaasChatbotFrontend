import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";

const index = () => {
  return (
    <SafeAreaView className="bg-white flex h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center items-center h-full px-4">
          <Image
            source={images.icon}
            className="w-16 h-16 my-4"
            resizeMode="contain"
          />
          <Text className="text-black font-psemibold text-4xl">HiPaaS AI</Text>
          <Text className="text-black font-pmedium text-2xl my-4">
            AI That Knows Your Product Inside Out
          </Text>

          <CustomButton
            title="Get Started"
            containerStyle="w-full mt-10 shadow-lg shadow-[#9290c3]"
            handlePress={() => router.push("/signin")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;
