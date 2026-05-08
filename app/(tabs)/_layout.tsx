import { Tabs } from "expo-router";
import { Image } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: "#91b39b",
          borderTopWidth: 0,
          height: 62,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },

        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#aaaaaa",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({size }) => (
            <Image
              source={require("../../assets/images/home-icon.png")}
              style={{ width: size + 10, height: size + 10, resizeMode: "contain" }}
              />
          ),
        }}
      />

      <Tabs.Screen
        name="challenges"
        options={{
          title: "Challenges",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("../../assets/images/challenges-icon.png")}
              style={{ width: size + 10, height: size + 10, resizeMode: "contain" }}
              />
          ),
        }}
      />

      <Tabs.Screen
        name="pets"
        options={{
          title: "Pets",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("../../assets/images/pets-icon.png")}
              style={{ width: size + 10, height: size + 10, resizeMode: "contain" }}
              />
          ),
        }}
      />

      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarIcon: ({ color, size }) => (
          <Image
              source={require("../../assets/images/feed-icon.png")}
              style={{ width: size + 10, height: size + 10, resizeMode: "contain" }}
              />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
          <Image
              source={require("../../assets/images/profile-icon.png")}
              style={{ width: size + 10, height: size + 10, resizeMode: "contain" }}
              />
          ),
        }}
      />
    </Tabs>
  );

}
