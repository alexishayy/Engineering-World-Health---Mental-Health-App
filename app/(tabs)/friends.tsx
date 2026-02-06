import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
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
    //TITLE
    <SafeAreaView style={styles.screen} edges={["top"]}>
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
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#4f8f52",
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
    backgroundColor: '#bdbdbd',
    borderBlockColor: '#0a0909',
    borderWidth: 1.5,
    zIndex: -1,
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "800",
    top: 40,
    left: 35,
  },
  body: {
    flex: 1,
  },
  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 50,
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
    backgroundColor: "white",
    top: 70,
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
    padding: 20,
  },
});
