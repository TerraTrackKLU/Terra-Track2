import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Text as Textt,
} from "react-native";
import * as d3Shape from "d3-shape";
import Svg, { G, Text, TSpan, Path, Polygon } from "react-native-svg";
import LottieView from "lottie-react-native";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const { width, height } = Dimensions.get("screen");

const WheelSpin = ({ colors, texts, onFinish, onWinnerPress, winnerPost }) => {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const angle = useRef(new Animated.Value(0)).current;
  const startedRef = useRef(false);
  const winnerOpacity = useRef(new Animated.Value(0)).current;
  const resultScale = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef(null);

  const numberOfSegments = texts.length;
  const fontSize = 20;
  const oneTurn = 360;
  const angleBySegment = oneTurn / numberOfSegments;
  const angleOffset = angleBySegment / 2;

  useEffect(() => {
    if (finished) {
      Animated.sequence([
        Animated.timing(winnerOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(resultScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        lottieRef.current?.play();
        setTimeout(() => {
          Animated.timing(winnerOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            setFinished(false);
          });
        }, 3000);
      });
    }
  }, [finished, winnerOpacity, resultScale]);

  const makeWheel = () => {
    const data = Array.from({ length: numberOfSegments }).fill(1);
    const arcs = d3Shape.pie()(data);
    return arcs.map((arc, index) => {
      const instance = d3Shape
        .arc()
        .padAngle(0.01)
        .outerRadius(width / 2)
        .innerRadius(100);
      return {
        path: instance(arc),
        color: colors[index % colors.length],
        value: texts[index],
        centroid: instance.centroid(arc),
      };
    });
  };

  const wheelPaths = makeWheel();

  const textRender = (x, y, number, i) => (
    <Text
      x={x - number.length * 5}
      y={y - 80}
      fill="#fff"
      textAnchor="middle"
      fontSize={fontSize}
    >
      {Array.from({ length: number.length }).map((_, j) => (
        <TSpan y={y - 10} dx={fontSize * 0.04} key={`arc-${i}-slice-${j}`}>
          {number.charAt(j)}
        </TSpan>
      ))}
    </Text>
  );

  const renderSvgWheel = () => (
    <View style={styles.wheelContainer}>
      <Animated.View
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: [
            {
              rotate: angle.interpolate({
                inputRange: [-oneTurn, 0, oneTurn],
                outputRange: [`-${oneTurn}deg`, `0deg`, `${oneTurn}deg`],
              }),
            },
          ],
          backgroundColor: "transparent",
          width: width - 20,
          height: width - 20,
          borderRadius: (width - 20) / 2,
          borderWidth: 2,
        }}
      >
        <AnimatedSvg
          width={width - 20}
          height={width - 20}
          viewBox={`0 0 ${width} ${width}`}
          style={{
            transform: [{ rotate: `-${angleOffset}deg` }],
          }}
        >
          <G y={width / 2} x={width / 2}>
            {wheelPaths.map((arc, i) => {
              const [x, y] = arc.centroid;
              const number = arc.value.toString();
              return (
                <G key={`arc-${i}`}>
                  <Path d={arc.path} strokeWidth={2} fill={arc.color} />
                  <G
                    rotation={(i * oneTurn) / numberOfSegments + angleOffset}
                    origin={`${x}, ${y}`}
                  >
                    {textRender(x, y, number, i)}
                  </G>
                </G>
              );
            })}
          </G>
        </AnimatedSvg>
      </Animated.View>
      <Svg height={50} width={50} style={styles.pointer}>
        <Polygon points="25,0 50,50 0,50" fill="#0A6476" />
      </Svg>
    </View>
  );

  const onPress = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      const duration = 2000;
      const randomWinnerIndex = Math.floor(Math.random() * numberOfSegments);

      angle.setValue(0);

      Animated.timing(angle, {
        toValue:
          365 -
          randomWinnerIndex * (oneTurn / numberOfSegments) +
          360 * (duration / 1000),
        duration: duration,
        useNativeDriver: true,
      }).start(() => {
        setFinished(true);
        setWinnerIndex(randomWinnerIndex);
        onFinish(randomWinnerIndex);
        startedRef.current = false;
      });
    }
  };

  const renderTopToPlay = () => {
    if (!startedRef.current) {
      return (
        <TouchableOpacity onPress={onPress}>
          <View style={styles.button}>
            <Textt style={styles.buttonText}>Çevir</Textt>
          </View>
        </TouchableOpacity>
      );
    }
  };

  const renderWinner = () => {
    if (finished && winnerIndex !== null && winnerPost) {
      return (
        <Animated.View
          style={[
            styles.winnerContainer,
            {
              opacity: winnerOpacity,
              transform: [{ scale: resultScale }],
            },
          ]}
        >
          <TouchableOpacity onPress={() => onWinnerPress(winnerIndex)}>
            <Textt style={styles.winnerText}>{winnerPost}</Textt>
          </TouchableOpacity>
          <LottieView
            ref={lottieRef}
            source={require("../assets/Animations/Particule.json")}
            autoPlay={false}
            loop={false}
            style={styles.lottie}
          />
        </Animated.View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/Animations/BackgroundAnimation.json")}
        autoPlay
        loop
        style={styles.backgroundAnimation}
      />
      {renderSvgWheel()}
      {renderTopToPlay()}
      {renderWinner()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundAnimation: {
    position: "absolute",
    width: width * 1.5,
    height: height * 1.5,
    top: -(height * 0.25),
    left: -(width * 0.25),
    zIndex: -1,
  },
  wheelContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#0A6476",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  winnerContainer: {
    position: "absolute",
    top: "45%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 20,
    borderRadius: 8,
  },
  winnerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0A6476",
  },
  pointer: {
    position: "absolute",
    top: -25,
    left: (width - 20) / 2 - 25,
    transform: [{ translateY: -25 }, { rotate: "180deg" }],
    zIndex: 1,
  },
  lottie: {
    position: "absolute",
    width: 300,
    height: 300,
    zIndex: -1,
    transform: [{ scale: 1.5 }],
  },
});

export default WheelSpin;
