import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import axios from "axios";
import WheelSpin from "../../react-native-wheel-spin";
import { POST_HOMEPAGE } from "../constants/links";

const Cark = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [winnerPost, setWinnerPost] = useState(null);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(POST_HOMEPAGE);
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const colors = ["#E07026", "#E8C22E", "#ABC937", "#4F991D", "#22AFD3"];

  const texts = posts.map(() => "?");

  const handleWinnerPress = (winnerIndex) => {
    const selectedPost = posts[winnerIndex];
    if (selectedPost) {
      navigation.navigate("PostDetail", { postId: selectedPost._id });
    } else {
      console.error("Selected post not found");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <WheelSpin
          colors={colors}
          texts={texts}
          onFinish={(winnerIndex) => {
            setWinnerPost(posts[winnerIndex].title);
          }}
          onWinnerPress={handleWinnerPress}
          winnerPost={winnerPost} // winnerPost'u WheelSpin'e geçiriyoruz
        />
      )}
    </View>
  );
};

export default Cark;
