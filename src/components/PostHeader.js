import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import mehmet from "../Images/mehmet.jpg";
import PostCard from "./PostCard";
import { Feather } from "@expo/vector-icons";
import CommentSection from "./CommentSection";

const PostHeader = ({ post }) => {
  return (
    <View style={styles.container}>
      <View style={styles.nameContainer}>
        <Image source={mehmet} style={styles.personImage} />
        <View>
          <Text style={styles.personName}>{post.username}</Text>
          <Text style={styles.placeName}>{post.placeName}</Text>
        </View>
      </View>
      <View style={{ position: "relative" }}>
        <TouchableOpacity>
          <Feather name="more-vertical" size={24} color="black" />
        </TouchableOpacity>
        <CommentSection />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 12,
    paddingStart: 20,
    paddingEnd: 20,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
  },
  personImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  personName: {
    color: "black",
    marginStart: 10,
    fontWeight: "bold",
  },
  placeName: {
    color: "black",
    marginStart: 10,
    fontSize: 12,
  },
  iconMore: {
    width: 15,
    height: 15,
  },
});

export default PostHeader;
