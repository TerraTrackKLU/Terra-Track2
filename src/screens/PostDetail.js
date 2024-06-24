import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, TextInput } from 'react-native';
import { Button, IconButton, Card } from 'react-native-paper';
import axios from 'axios';

const PostDetail = ({ navigation, route }) => {
    const { postId } = route.params;
    const [post, setPost] = useState({
        title: 'Monopetra-Çifte Kaynaklar',
        date: '2023-06-10',
        tags: ['Etiket 1', 'Etiket 2'],
        distance: '10 km',
        difficulty: 'Orta',
        duration: '3 saat',
        routeType: 'Döngü',
        description: 'Bu rota doğanın güzelliklerini keşfetmek için ideal bir parkurdur. Yürüyüş boyunca eşsiz manzaraların keyfini çıkarabilirsiniz.',
        images: [
            'https://via.placeholder.com/800x400.png?text=Photo+1',
            'https://via.placeholder.com/800x400.png?text=Photo+2',
            'https://via.placeholder.com/800x400.png?text=Photo+3',
        ],
    });

    const [isFavorite, setIsFavorite] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const handleFollowRoute = () => {
        navigation.navigate('Map'); // 'Map' sayfasına yönlendirir
    };

    const handleComment = () => {
        if (newComment.trim() !== '') {
            setComments([...comments, { text: newComment, date: new Date() }]);
            setNewComment('');
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

    const handleUpdatePost = () => {
        navigation.navigate('PostUpdate', { postId });
    };

    const handleDeletePost = async () => {
        try {
            await axios.delete(`http://172.20.10.2:5000/terra-track/api/posts/${postId}`);
            Alert.alert('Post Silme', 'Post başarıyla silindi.');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Hata', 'Post silinirken bir hata oluştu.');
        }
    };

    const renderItem = ({ item }) => (
        <Image source={{ uri: item }} style={styles.image} />
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.contentContainer}>
                <Button mode="contained" onPress={handleFollowRoute} style={styles.followButton}>
                    Rotayı Takip Et
                </Button>
                <View style={styles.tagsContainer}>
                    {post.tags.map((tag, index) => (
                        <Text key={index} style={styles.tag}>
                            {tag}
                        </Text>
                    ))}
                </View>
                <Text style={styles.title}>{post.title}</Text>
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
                <View style={styles.buttonContainer}>
                    <Button mode="contained" onPress={handleUpdatePost} style={styles.updateButton}>
                         Güncelle
                    </Button>
                    <Button mode="contained" onPress={handleDeletePost} style={styles.deleteButton}>
                         Sil
                    </Button>
                </View>
                <Card style={styles.card}>
                    <Card.Title title="Yorumlar ve Değerlendirmeler" />
                    <Card.Content>
                        {comments.length === 0 ? (
                            <Text>Henüz yorum yapılmamış. İlk yorumu siz yapın!</Text>
                        ) : (
                            comments.map((comment, index) => (
                                <View key={index} style={styles.comment}>
                                    <Text>{comment.text}</Text>
                                    <Text style={styles.commentDate}>
                                        {comment.date.toLocaleDateString()}{' '}
                                        {comment.date.toLocaleTimeString()}
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    updateButton: {
        backgroundColor: '#f0ad4e',
        borderRadius: 8,
        padding: 10,
        flex: 1,
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: '#d9534f',
        borderRadius: 8,
        padding: 10,
        flex: 1,
        marginLeft: 10,
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
