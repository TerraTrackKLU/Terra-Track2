import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
// import nature from "../Images/nature.jpg";
import mehmet2 from "../Images/mehmet2.jpg";
const PostImage = ({ post }) => {
  return <Image source={mehmet2} style={styles.postImg} />;
};

const styles = StyleSheet.create({
  postImg: {
    height: 450,
    width: "100%",
  },
});

export default PostImage;
