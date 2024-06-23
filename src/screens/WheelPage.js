// import React, { useState, useRef } from "react";
// import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Modal } from "react-native";

// const WheelPage = () => {
//     const [winner, setWinner] = useState(null);
//     const [modalVisible, setModalVisible] = useState(false);
//     const animatedValue = useRef(new Animated.Value(0)).current;
//     const [result, setResult] = useState(null);

//     const participants = [
//         { option: 'Değer 1', color: '#FF0000' },
//         { option: 'Değer 2', color: '#00FF00' },
//         { option: 'Değer 3', color: '#0000FF' },
//         { option: 'Değer 4', color: '#FFFF00' },
//         { option: 'Değer 5', color: '#FF00FF' },
//         { option: 'Değer 6', color: '#00FFFF' },
//     ];

//     const spinWheel = () => {
//         const randomValue = Math.floor(Math.random() * participants.length);
//         const endValue = 360 * 3 + (360 / participants.length) * randomValue;
//         setResult(participants[randomValue].option);

//         Animated.timing(animatedValue, {
//             toValue: endValue,
//             duration: 5000,
//             easing: Easing.out(Easing.quad),
//             useNativeDriver: true,
//         }).start(() => {
//             setModalVisible(true);
//             animatedValue.setValue(0);
//         });
//     };

//     const spin = animatedValue.interpolate({
//         inputRange: [0, 360],
//         outputRange: ["0deg", "360deg"],
//     });

//     return (
//         <View style={styles.container}>
//             <Animated.View style={{ transform: [{ rotate: spin }] }}>
//                 <View style={styles.wheel}>
//                     {participants.map((participant, index) => (
//                         <View
//                             key={index}
//                             style={[
//                                 styles.slice,
//                                 {
//                                     backgroundColor: participant.color,
//                                     transform: [
//                                         { rotate: `${(360 / participants.length) * index}deg` },
//                                         { skewY: '-30deg' },
//                                     ],
//                                 },
//                             ]}
//                         >
//                             <Text style={styles.sliceText}>{participant.option}</Text>
//                         </View>
//                     ))}
//                 </View>
//             </Animated.View>
//             <TouchableOpacity style={styles.button} onPress={spinWheel}>
//                 <Text style={styles.buttonText}>Çevir</Text>
//             </TouchableOpacity>

//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={modalVisible}
//                 onRequestClose={() => setModalVisible(false)}
//             >
//                 <View style={styles.modalContainer}>
//                     <View style={styles.modalContent}>
//                         <Text style={styles.modalText}>Kazanan: {result}</Text>
//                         <TouchableOpacity
//                             style={styles.closeButton}
//                             onPress={() => setModalVisible(false)}
//                         >
//                             <Text style={styles.closeButtonText}>Kapat</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#f8f9fa',
//     },
//     wheel: {
//         width: 300,
//         height: 300,
//         borderRadius: 150,
//         borderWidth: 5,
//         borderColor: '#000',
//         overflow: 'hidden',
//     },
//     slice: {
//         position: 'absolute',
//         width: '50%',
//         height: '50%',
//         justifyContent: 'center',
//         alignItems: 'center',
//         top: '50%',
//         left: '50%',
//         marginLeft: '-25%',
//         marginTop: '-50%',
//     },
//     sliceText: {
//         color: '#fff',
//         fontWeight: 'bold',
//         transform: [{ rotate: '30deg' }],
//     },
//     button: {
//         marginTop: 30,
//         paddingVertical: 15,
//         paddingHorizontal: 30,
//         backgroundColor: '#6200ee',
//         borderRadius: 8,
//     },
//     buttonText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0,0,0,0.5)',
//     },
//     modalContent: {
//         width: 300,
//         padding: 20,
//         backgroundColor: 'white',
//         borderRadius: 8,
//         alignItems: 'center',
//     },
//     modalText: {
//         fontSize: 18,
//         marginBottom: 20,
//     },
//     closeButton: {
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         backgroundColor: '#6200ee',
//         borderRadius: 8,
//     },
//     closeButtonText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
// });

// export default WheelPage;
