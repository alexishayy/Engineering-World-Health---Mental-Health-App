import React, { useState } from 'react';
import { FlatList, ImageBackground, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//dummy data
const friendData = [
  {id: '1', name: 'Username1'},
  {id: '2', name: 'Username2'},
  {id: '3', name: 'Username3'},
  {id: '4', name: 'Username4'},
  {id: '5', name: 'Username5'},
  {id: '6', name: 'Username6'}
];
export default function FriendsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFriends, setFilterFriends] = useState(friendData);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = friendData.filter((friend) =>
    friend.name.toLowerCase().includes(text.toLowerCase())
  );
  setFilterFriends(filtered);
  }
  return (
    <ImageBackground
      source={require("../../assets/images/bg.jpg")} 
      style={{ flex: 1 }}
      resizeMode="cover"
    >

    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.topBar}>
              <View style={styles.avatarDot} />
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>🔥 Streak : 12</Text>
              </View>
            </View>
      <View style={styles.header}>
        <View style={styles.headerBlock} />
        <Text style={styles.headerText}>Add A Friend!</Text>
        {/*FRIEND SEARCH BAR*/}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends..."
            value = {searchQuery}
            onChangeText = {handleSearch}
            placeholderTextColor = "#4c4b4b"
            />
        </View>
      </View>
      <View style={styles.body}> 
        <Text style={styles.listHeaderText}>
          Your Friends ({filterFriends.length})
        </Text>
      {/*FRIENDS LIST */}
         <FlatList
          data={friendData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.friendItem}>
              <View style={styles.avatarPlaceholder} />
              <View>
                <Text style={styles.friendName}>{item.name}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "transparent",
  },
  topBar: {
    height: 64,
    backgroundColor: "#3E5870",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  avatarDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "white",
  },
  streakPill: {
    borderWidth: 1,
    borderColor: "#C9C2B6",
    backgroundColor: "#FBF7EF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  streakText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1B1B1B",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 1,
  },
  headerBlock: {
    position: 'absolute',
    top: 32,
    left: 30,
    right: 35,
    height: 140,
    borderRadius: 30,
    backgroundColor: "#edf3fa",
    borderBlockColor: '#b9b9b9',
    borderLeftColor: '#b9b9b9',
    borderRightColor: '#b9b9b9',
    borderWidth: 1.5,
    zIndex: -1,
  },
  headerText: {
    color: '#0a0909',
    fontSize: 22,
    fontWeight: "800",
    top: 40,
    left: 35,
  },
  listHeaderText: {
    fontSize: 30,
    fontWeight: "700",
    marginLeft: 40,
    marginTop: 70,
    marginBottom: 20,
    color: '#0a0909'
  },
  body: {
    flex: 1,
  },
  searchContainer: {
    backgroundColor: '#fff',
    borderBlockColor: '#b9b9b9',
    borderLeftColor: '#b9b9b9',
    borderRightColor: '#b9b9b9',
    borderRadius: 50,
    borderWidth: 1.5,
    marginVertical: 10,
    paddingHorizontal: 20,
    top: 50,
    left:30,
    right:60,
    height: 45,
    width: 300,
    justifyContent: 'center',
  },
  searchInput: {
    fontSize: 16,
    color: '#000',
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecf5ff",
    borderBlockColor: '#b9b9b9',
    borderLeftColor: '#b9b9b9',
    borderRightColor: '#b9b9b9',
    borderWidth: 1.2,
    left: 25,
    right: 25,
    padding: 13,
    borderRadius: 30,
    marginBottom: 10,
    width: 300,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
    marginRight: 15,
    padding:5,
  },
  friendName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  listContainer: {
    height: 100,
    paddingTop: 5,
    paddingHorizontal: 15,

  },
});
