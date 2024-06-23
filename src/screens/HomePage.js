import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import { Appbar, Avatar, Card } from "react-native-paper";
import { useSelector } from "react-redux";

const HomePage = ({ navigation }) => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "john_doe",
      avatar: "https://via.placeholder.com/150",
      image: "https://via.placeholder.com/500",
      caption: "Beautiful day!",
    },
    {
      id: 2,
      user: "jane_doe",
      avatar: "https://via.placeholder.com/150",
      image: "https://via.placeholder.com/500",
      caption: "Lovely sunset!",
    },
    // Daha fazla örnek gönderi ekleyebilirsiniz
  ]);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    console.log(user);
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Home" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
        <Appbar.Action icon="message" onPress={() => {}} />
      </Appbar.Header>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Terra</Text>
          <Image source={require("../Images/logo.png")} style={styles.logo} />
          <Text style={styles.logoText}>Track</Text>
        </View>
      </View>

      <Button
        title="Post Paylaş"
        onPress={() => navigation.navigate("PostShare")} // Ensure this matches the screen name
      />

      <ScrollView>
        {posts.map((post) => (
          <Card key={post.id} style={styles.card}>
            <Card.Title
              title={post.user}
              left={(props) => (
                <Avatar.Image {...props} source={{ uri: post.avatar }} />
              )}
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("PostDetail", { postId: post.id })
              }
            >
              <Card.Cover source={{ uri: post.image }} />
            </TouchableOpacity>
            <Card.Content>
              <Text style={styles.caption}>{post.caption}</Text>
            </Card.Content>
            <Card.Actions>
              <Button title="Like" onPress={() => {}}>
                Like
              </Button>
              <Button title="Comment" onPress={() => {}}>
                Comment
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  card: {
    margin: 10,
    borderRadius: 8,
  },
  caption: {
    marginTop: 10,
  },
  feedContainer: {
    display: "flex",
  },
  logo: {
    width: 40,
    height: 32,
  },
  logoText: {
    height: 35,
    fontSize: 20,
    top: 3,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  logoContainer: {
    width: "70%",
    height: 40,
    backgroundColor: "green",
    borderRadius: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomePage;
