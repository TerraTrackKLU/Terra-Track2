import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import logo from "../Images/logo.png";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

const PostActions = () => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={() => console.log("test")}>
          <AntDesign name="like2" size={27} color="black" marginRight={10} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("test")}>
          <FontAwesome
            name="comment-o"
            size={27}
            color="black"
            marginRight={10}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("test")}>
          <Feather
            name="more-horizontal"
            size={27}
            color="black"
            marginRight={10}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => console.log("test")}>
        <MaterialIcons name="save-alt" size={27} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingStart: 20,
    paddingEnd: 20,
    paddingTop: 5,
    paddingBottom: 15,
  },
});

export default PostActions;
