// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, TextInput } from 'react-native';
// import { Button, IconButton, Card } from 'react-native-paper';
// // import Carousel from 'react-native-snap-carousel';

// const PostDetail = ({ navigation }) => {
//     const [isFavorite, setIsFavorite] = useState(false);
//     const [comments, setComments] = useState([]);
//     const [newComment, setNewComment] = useState('');

//     const post = {
//         title: 'Monopetra-Çifte Kaynaklar',
//         date: '2023-06-10',
//         tags: ['Etiket 1', 'Etiket 2'],
//         distance: '10 km',
//         difficulty: 'Orta',
//         duration: '3 saat',
//         routeType: 'Döngü',
//         description: 'Bu rota doğanın güzelliklerini keşfetmek için ideal bir parkurdur. Yürüyüş boyunca eşsiz manzaraların keyfini çıkarabilirsiniz.',
//         images: [
//             'https://via.placeholder.com/800x400.png?text=Photo+1',
//             'https://via.placeholder.com/800x400.png?text=Photo+2',
//             'https://via.placeholder.com/800x400.png?text=Photo+3',
//         ],
//     };

//     const handleFollowRoute = () => {
//         navigation.navigate('Map'); // 'Map' sayfasına yönlendirir
//     };

//     const handleComment = () => {
//         if (newComment.trim() !== '') {
//             setComments([...comments, { text: newComment, date: new Date() }]);
//             setNewComment('');
//         } else {
//             Alert.alert('Uyarı', 'Yorum boş olamaz.');
//         }
//     };

//     const handleFavorite = () => {
//         setIsFavorite(!isFavorite);
//         Alert.alert(
//             'Favori Durumu',
//             isFavorite ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi'
//         );
//     };

//     const renderItem = ({ item }) => (
//         <Image source={{ uri: item }} style={styles.image} />
//     );

//     return (
//         <ScrollView style={styles.container}>
//             {/* <Carousel
//                 data={post.images}
//                 renderItem={renderItem}
//                 sliderWidth={400}
//                 itemWidth={400}
//                 loop={true}
//             /> */}
//             <View style={styles.contentContainer}>
//                 <Button mode="contained" onPress={handleFollowRoute} style={styles.followButton}>
//                     Rotayı Takip Et
//                 </Button>
//                 <View style={styles.tagsContainer}>
//                     {post.tags.map((tag, index) => (
//                         <Text key={index} style={styles.tag}>
//                             {tag}
//                         </Text>
//                     ))}
//                 </View>
//                 <Text style={styles.title}>{post.title}</Text>
//                 <Text style={styles.date}>{post.date}</Text>
//                 <View style={styles.detailsContainer}>
//                     <View style={styles.detailItem}>
//                         <Text style={styles.detailTitle}>Mesafe</Text>
//                         <Text style={styles.detailValue}>{post.distance}</Text>
//                     </View>
//                     <View style={styles.divider} />
//                     <View style={styles.detailItem}>
//                         <Text style={styles.detailTitle}>Zorluk</Text>
//                         <Text style={styles.detailValue}>{post.difficulty}</Text>
//                     </View>
//                     <View style={styles.divider} />
//                     <View style={styles.detailItem}>
//                         <Text style={styles.detailTitle}>Toplam Süre</Text>
//                         <Text style={styles.detailValue}>{post.duration}</Text>
//                     </View>
//                     <View style={styles.divider} />
//                     <View style={styles.detailItem}>
//                         <Text style={styles.detailTitle}>Rota Türü</Text>
//                         <Text style={styles.detailValue}>{post.routeType}</Text>
//                     </View>
//                 </View>
//                 <Text style={styles.description}>{post.description}</Text>
//                 <View style={styles.actionsContainer}>
//                     <View style={styles.iconButtonContainer}>
//                         <IconButton
//                             icon="comment"
//                             color="white"
//                             size={24}
//                             style={styles.iconButton}
//                             onPress={handleComment}
//                         />
//                         <Text style={styles.iconLabel}>Yorum Yap</Text>
//                     </View>
//                     <View style={styles.iconButtonContainer}>
//                         <IconButton
//                             icon="heart"
//                             color={isFavorite ? 'red' : 'white'}
//                             size={24}
//                             style={styles.iconButton}
//                             onPress={handleFavorite}
//                         />
//                         <Text style={styles.iconLabel}>Favori</Text>
//                     </View>
//                 </View>
//                 <Card style={styles.card}>
//                     <Card.Title title="Yorumlar ve Değerlendirmeler" />
//                     <Card.Content>
//                         {comments.length === 0 ? (
//                             <Text>Henüz yorum yapılmamış. İlk yorumu siz yapın!</Text>
//                         ) : (
//                             comments.map((comment, index) => (
//                                 <View key={index} style={styles.comment}>
//                                     <Text>{comment.text}</Text>
//                                     <Text style={styles.commentDate}>
//                                         {comment.date.toLocaleDateString()}{' '}
//                                         {comment.date.toLocaleTimeString()}
//                                     </Text>
//                                 </View>
//                             ))
//                         )}
//                         <TextInput
//                             style={styles.input}
//                             placeholder="Yorumunuzu yazın..."
//                             value={newComment}
//                             onChangeText={(text) => setNewComment(text)}
//                         />
//                         <Button mode="contained" onPress={handleComment} style={styles.submitButton}>
//                             Yorum Gönder
//                         </Button>
//                     </Card.Content>
//                 </Card>
//             </View>
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f8f9fa',
//     },
//     contentContainer: {
//         padding: 20,
//     },
//     followButton: {
//         marginBottom: 20,
//         backgroundColor: '#6200ee',
//     },
//     tagsContainer: {
//         flexDirection: 'row',
//         marginBottom: 20,
//     },
//     tag: {
//         backgroundColor: '#03dac6',
//         color: 'white',
//         paddingHorizontal: 10,
//         paddingVertical: 5,
//         borderRadius: 20,
//         marginRight: 10,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 10,
//     },
//     date: {
//         fontSize: 16,
//         color: '#666',
//         marginBottom: 20,
//     },
//     detailsContainer: {
//         marginBottom: 20,
//     },
//     detailItem: {
//         marginBottom: 10,
//     },
//     detailTitle: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     detailValue: {
//         fontSize: 16,
//         color: '#666',
//     },
//     divider: {
//         borderBottomColor: '#ccc',
//         borderBottomWidth: 1,
//         marginVertical: 10,
//     },
//     description: {
//         fontSize: 16,
//         color: '#333',
//         marginBottom: 20,
//     },
//     actionsContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         marginBottom: 20,
//     },
//     iconButtonContainer: {
//         alignItems: 'center',
//     },
//     iconButton: {
//         backgroundColor: '#6200ee',
//         borderRadius: 50,
//     },
//     iconLabel: {
//         color: '#333',
//         fontSize: 14,
//         marginTop: 5,
//     },
//     image: {
//         width: '100%',
//         height: 200,
//         borderRadius: 10,
//         marginBottom: 20,
//     },
//     card: {
//         marginTop: 20,
//         borderRadius: 10,
//     },
//     comment: {
//         borderBottomColor: '#ccc',
//         borderBottomWidth: 1,
//         paddingBottom: 10,
//         marginBottom: 10,
//     },
//     commentDate: {
//         fontSize: 12,
//         color: '#666',
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 8,
//         padding: 10,
//         marginTop: 10,
//     },
//     submitButton: {
//         marginTop: 10,
//         backgroundColor: '#6200ee',
//     },
// });

// export default PostDetail;
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, TextInput } from 'react-native';
import { Button, IconButton, Card } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../constants/links';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PostDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { routeId, postId } = route.params;

  const [post, setPost] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        let response;
        if (routeId) {
          response = await axios.get(`${BASE_URL}/routes/${routeId}`);
        } else if (postId) {
          response = await axios.get(`${BASE_URL}/posts/${postId}`);
        }
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/comments/${routeId || postId}`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    const getUserIdAndName = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);

      const response = await axios.get(`${BASE_URL}/auth/get-user`, {
        headers: { userid: id }
      });
      setUserName(response.data.name);
    };

    fetchPost();
    fetchComments();
    getUserIdAndName();
  }, [routeId, postId]);

  const handleFollowRoute = () => {
    navigation.navigate('Map');
  };

  const handleComment = async () => {
    if (newComment.trim() !== '') {
      try {
        const commentData = {
          route: routeId || postId,
          user: userId,
          text: newComment
        };
        const response = await axios.post(`${BASE_URL}/comments`, commentData);
        setComments([...comments, { ...response.data, user: { _id: userId, name: userName } }]);
        setNewComment('');
      } catch (error) {
        console.error('Error posting comment', error);
        Alert.alert('Error', 'Yorum gönderilemedi. Lütfen tekrar deneyin.');
      }
    } else {
      Alert.alert('Uyarı', 'Yorum boş olamaz.');
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      'Favori Durumu',
      isFavorite ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi'
    );
  };

  if (!post) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {post.images && post.images.length > 0 ? (
        post.images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} />
        ))
      ) : (
        <View style={styles.mapErrorContainer}>
          <Text style={styles.mapErrorText}>Harita yüklenmedi</Text>
        </View>
      )}
      <View style={styles.contentContainer}>
        <Button mode="contained" onPress={handleFollowRoute} style={styles.followButton}>
          Rotayı Takip Et
        </Button>
        <View style={styles.tagsContainer}>
          {post.tags && post.tags.map((tag, index) => (
            <Text key={index} style={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
        <Text style={styles.title}>{post.routeName || post.title}</Text>
        <Text style={styles.date}>{post.date}</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Mesafe</Text>
            <Text style={styles.detailValue}>{post.distance}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Zorluk</Text>
            <Text style={styles.detailValue}>{post.difficulty}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Toplam Süre</Text>
            <Text style={styles.detailValue}>{post.duration}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Rota Türü</Text>
            <Text style={styles.detailValue}>{post.routeType}</Text>
          </View>
        </View>
        <Text style={styles.description}>{post.description}</Text>
        <View style={styles.actionsContainer}>
          <View style={styles.iconButtonContainer}>
            <IconButton
              icon="comment"
              color="white"
              size={24}
              style={styles.iconButton}
              onPress={handleComment}
            />
            <Text style={styles.iconLabel}>Yorum Yap</Text>
          </View>
          <View style={styles.iconButtonContainer}>
            <IconButton
              icon="heart"
              color={isFavorite ? 'red' : 'white'}
              size={24}
              style={styles.iconButton}
              onPress={handleFavorite}
            />
            <Text style={styles.iconLabel}>Favori</Text>
          </View>
        </View>
        <Card style={styles.card}>
          <Card.Title title="Yorumlar ve Değerlendirmeler" />
          <Card.Content>
            {comments.length === 0 ? (
              <Text>Henüz yorum yapılmamış. İlk yorumu siz yapın!</Text>
            ) : (
              comments.map((comment, index) => (
                <View key={index} style={styles.comment}>
                  <Text style={styles.commentUser}>{comment.user.name}</Text>
                  <Text>{comment.text}</Text>
                  <Text style={styles.commentDate}>
                    {new Date(comment.date).toLocaleDateString()}{' '}
                    {new Date(comment.date).toLocaleTimeString()}
                  </Text>
                </View>
              ))
            )}
            <TextInput
              style={styles.input}
              placeholder="Yorumunuzu yazın..."
              value={newComment}
              onChangeText={(text) => setNewComment(text)}
            />
            <Button mode="contained" onPress={handleComment} style={styles.submitButton}>
              Yorum Gönder
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 20,
  },
  followButton: {
    marginBottom: 20,
    backgroundColor: '#6200ee',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#03dac6',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailItem: {
    marginBottom: 10,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailValue: {
    fontSize: 16,
    color: '#666',
  },
  divider: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  iconButtonContainer: {
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: '#6200ee',
    borderRadius: 50,
  },
  iconLabel: {
    color: '#333',
    fontSize: 14,
    marginTop: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  mapErrorContainer: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  mapErrorText: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    marginTop: 20,
    borderRadius: 10,
  },
  comment: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
  },
  commentUser: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  commentDate: {
    fontSize: 12,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: '#6200ee',
  },
});

export default PostDetail;
