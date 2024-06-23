import * as React from "react";
import { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";

const Search = () => {
  const [filterData, setFilterData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPosts();
    return () => {};
  }, []);

  const fetchPosts = () => {
    const apiURL = "https://jsonplaceholder.typicode.com/posts";
    fetch(apiURL)
      .then((response) => response.json())
      .then((resposeJson) => {
        setFilterData(resposeJson);
        setMasterData(resposeJson);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const searchFilter = (text) => {
    if (text) {
      const newData = masterData.filter((item) => {
        const itemData = item.title
          ? item.title.toUpperCase()
          : "".toUpperCase();

        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilterData(newData);
      setSearch(text);
    } else {
      setFilterData(masterData);
      setSearch(text);
    }
  };

  const ItemView = ({ item }) => {
    return (
      <Text style={styles.itemStyle}>
        {item.id}
        {"."}
        {item.title.toUpperCase()}
      </Text>
    );
  };

  const ItemSeparatorView = () => {
    return (
      <View
        style={{ height: 0.5, width: "100%", backgroundColor: "blue" }}
      ></View>
    );
  };

  return (
    <View>
      <TextInput
        style={styles.textInputStyle}
        value={search}
        placeholder="Search"
        underlineColorAndroid="transparent"
        onChangeText={(Text) => searchFilter(Text)}
      />
      {/* <FlatList
        data={filterData}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={ItemView}
      /> */}
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  itemStyle: {
    padding: 20,
  },
  textInputStyle: {
    width: "200%",
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 9,
    borderColor: "red",
    backgroundColor: "white",
  },
});
