import React, { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { Button as PaperButton } from "react-native-paper";

const LikeButton = ({ isLiked, onPress, likeCount }) => {
  const animation = useRef(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const handlePress = () => {
    if (!isLiked) {
      setShowButton(false);
      setShowAnimation(true);
      setTimeout(() => {
        if (animation.current) {
          animation.current.play();
        }
        setTimeout(() => {
          setShowAnimation(false);
          setShowButton(true);
        }, 1750); // Animasyonu 1.75 saniye göster
      }, 100); // LottieView render edilene kadar kısa bir gecikme ekle
    }
    onPress();
  };

  return (
    <View style={styles.likeButtonContainer}>
      {showButton && (
        <PaperButton
          icon={isLiked ? "heart" : "heart-outline"}
          color={isLiked ? "red" : undefined}
          onPress={handlePress}
          contentStyle={styles.buttonContent} // İçeriği stilini ekleyin
          labelStyle={styles.buttonLabel} // Etiketi stilini ekleyin
        >
          Like {likeCount}
        </PaperButton>
      )}
      {showAnimation && (
        <LottieView
          ref={animation}
          source={require("../../assets/Animations/likebuttonAnimation.json")}
          style={styles.likeAnimation}
          loop={false}
          autoPlay={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  likeButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonContent: {
    height: 50, // Butonun yüksekliğini artırın
  },
  buttonLabel: {
    fontSize: 20, // Buton etiketi boyutunu artırın
  },
  likeAnimation: {
    width: 50, // Animasyon boyutunu artırın
    height: 50, // Animasyon boyutunu artırın
    marginLeft: -80, // Animasyonu sola kaydırın
  },
});

export default LikeButton;
