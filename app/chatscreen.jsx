import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "../constants";
import { contextdata } from "../context/ChatContext";
import { logout } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Markdown from "react-native-markdown-display";

const ChatScreen = () => {
  const user = useSelector((state) => state.auth.user);
  const [username, setUsername] = useState(user?.name || "User");

  const [newContext, setNewContext] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `Hello **${username}**, this is your personal assistant.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const dispatch = useDispatch();

  const fetchLatestContext = async () => {
    try {
      const latestContext = await contextdata(); // Await the async function

      // Ensure there is context data before attempting to set it
      if (latestContext) {
        setNewContext(latestContext); // Set the first context in the array
        console.log("Latest context: ", latestContext);
      } else {
        console.log("No context data available.");
      }
    } catch (error) {
      console.error("Error fetching latest context:", error);
    }
  };

  // Call the function to fetch the context when needed
  fetchLatestContext();

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);

    // Set loading state
    setIsLoading(true);
    setInput("");

    try {
      // Prepare the request body
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `${newContext}\nUser: ${input}\nAssistant (provide a short response):`,
              },
            ],
          },
        ],
      };

      // console.log("Request Body:", JSON.stringify(requestBody, null, 2)); // Debugging log

      // Call the Gemini API with context
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.EXPO_PUBLIC_GEMINI_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error("Failed to fetch from API");
      }

      const data = await response.json();

      const botMessage = {
        text:
          data.candidates && data.candidates.length > 0
            ? data.candidates[0].content.parts[0].text.trim()
            : "Sorry, I didn't understand that.",
        isUser: false,
      };

      // Add bot response to chat
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response from Gemini API:", error);
      const errorMessage = {
        text: "Sorry, something went wrong. Please try again later.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      // Clear input and reset loading state
      setInput("");
      setIsLoading(false); // Reset loading state
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    console.log("Logout successful:");
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <SafeAreaView className="bg-white flex h-full ">
      <View className="w-full h-20 bg-primary  flex-row justify-between items-center px-4">
        <View className="flex-row space-x-2 items-end justify-center">
          <Image
            source={images.icon}
            className="w-8 h-8"
            resizeMode="contain"
          />
          <Text className="text-white font-psemibold text-2xl">
            HiPaaS AI Chatbot
          </Text>
        </View>

        <TouchableOpacity onPress={handleLogout}>
          <Image
            source={icons.logout}
            className="w-8 h-8"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        className="flex-1 p-4"
        ref={chatEndRef}
        contentContainerStyle={{ paddingBottom: 20 }}
        onContentSizeChange={() =>
          chatEndRef.current.scrollToEnd({ animated: true })
        }
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            className={`w-full rounded-lg py-2 ${
              msg.isUser ? "items-end" : "items-start"
            }`}
          >
            <View
              className={`relative max-w-[85%] p-2 rounded-lg ${
                msg.isUser ? "bg-primary" : "bg-primary"
              } flex-row items-center`}
            >
              {!msg.isUser && (
                <Image
                  source={images.icon}
                  className="absolute top-4 left-2 w-6 h-6 mr-2"
                />
              )}

              {/* <Text className="text-[20px] text-white">{msg.text}</Text> */}
              <View
                className={`text-[20px] ${
                  !msg.isUser ? "pl-8" : "pr-8"
                } text-white flex max-w-[95%]`}
              >
                <Markdown style={markdownStyles}>{msg.text}</Markdown>
              </View>
              {msg.isUser && (
                <Image
                  source={icons.profile}
                  className="absolute top-4 right-2 w-7 h-7 ml-2"
                />
              )}
            </View>
          </View>
        ))}

        {isLoading && (
          <View className="flex-row items-center w-[45%] p-2 rounded-md bg-primary my-1">
            <Image source={images.icon} className="w-6 h-6 mr-2" />
            <Text className="text-[20px] font-pregular text-white">
              Generating...
            </Text>
            <ActivityIndicator className="ml-2" />
          </View>
        )}
      </ScrollView>

      <View className="w-full h-20 bg-white drop-shadow-lg fixed flex-row p-3 items-center justify-between">
        <TouchableOpacity className="w-[87%] bg-white border border-secondary flex-row items-center  rounded-full">
          <TextInput
            className="rounded-full placeholder-black-100 p-4 font-pregular text-[18px] h-full flex-1 text-left"
            placeholder="Need help? Type your question here..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSend}>
          <View className="bg-primary w-14 h-14 rounded-full justify-center items-center">
            <Image
              source={icons.send}
              resizeMode="contain"
              className="w-8 h-8 rotate-12"
            />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

const markdownStyles = {
  body: {
    color: "white",
    fontSize: 20,
  },
};
