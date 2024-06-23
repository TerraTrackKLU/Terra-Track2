import { View, Text, StyleSheet, FlatList } from "react-native";
import React from "react";
import PostHeader from "./PostHeader";
import PostImage from "./PostImage";
import PostActions from "./PostActions";

const PostCard = () => {
  const post = {
    username: "Mehmet Sait Arığ",
    placeName: "İstanbul, Türkiye",
    publishedAt: "2019-11-24T17:28:31.123Z",
  };

  return (
    <View>
      <FlatList
        data={[
          { key: "a" },
          { key: "b" },
          { key: "c" },
          { key: "d" },
          { key: "e" },
          { key: "f" },
          { key: "g" },
          { key: "h" },
        ]}
        renderItem={({ item, index }) => (
          <View>
            <PostHeader post={post} />
            <PostImage post={post} />
            <PostActions post={post} />
          </View>
        )}
      />
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    display: "flex",
  },
});
