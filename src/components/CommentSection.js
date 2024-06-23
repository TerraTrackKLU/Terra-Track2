import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

const CommentSection = () => {
  const [comment, setComment] = useState(""); // Kullanıcının girdiği yorumu saklayacak state
  const [comments, setComments] = useState([]); // Gösterilecek yorumları saklayacak state

  const handlePost = () => {
    if (comment.trim() !== "") {
      // Yorum boş değilse
      const updatedComments = [...comments, comment]; // Yeni yorumu mevcut yorumlar dizisine ekle
      setComments(updatedComments); // Yorumları güncelle
      setComment(""); // Yorum gönderildikten sonra input'u temizleme
    }
  };

  return (
    <View style={styles.container}>
      {/* Yorumları gösterme bölümü */}
      <ScrollView>
        {comments.map((commentText, index) => (
          <Text key={index} style={styles.submittedComment}>
            {commentText}
          </Text>
        ))}
      </ScrollView>

      {/* Yorum yazma alanı */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Yorumunuzu buraya yazın..."
          value={comment}
          onChangeText={(text) => setComment(text)} // Yorumun state'ini güncelleme
        />
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postText}>Gönder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    textAlign: "center",
    justifyContent: "center",
  },
  submittedComment: {
    marginVertical: 3,
    paddingHorizontal: 10,
    backgroundColor: "green",
    borderRadius: 8,
    fontSize: 16,
  },
});

export default CommentSection;
