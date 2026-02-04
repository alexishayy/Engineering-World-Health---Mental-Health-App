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
        <Text style={styles.headerText}>Friends Screen</Text>
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
          data={filterFriends}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const firstElem = index == 0;
            const lastElem = index == friendData.length - 1;
            return(
            <View style={[
              styles.friendItem,
              firstElem && styles.firstItem,
              lastElem && styles.lastItem,
              !lastElem && { borderBottomWidth: 1, borderBottomColor: '#eee'}
            ]}>
              <View style={styles.avatarPlaceholder} />
              <View>
                <Text style={styles.friendName}>{item.name}</Text>
              </View>
            </View>
          );
        }}
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
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "800",
  },
  body: {
    flex: 1,
  },
  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 20,
    height: 60,
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
    padding: 15,
    marginHorizontal: 20,
  },
  firstItem: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: 10,
  },
  lastItem: {
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginTop: 0,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
    marginRight: 15,
  },
  friendName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  listContainer: {
    paddingVertical: 10,
    paddingBottom: 40,
  },
});
