import React, { useState } from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    Animated,
    TouchableOpacity,
    Text as Textt,
} from 'react-native';
import * as d3Shape from 'd3-shape';

import Svg, { G, Text, TSpan, Path } from 'react-native-svg';
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const { width, height } = Dimensions.get('screen');

const WheelSpin = ({ colors, texts }) => {
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [winner, setWinner] = useState(null);
    const [gameScreen, setGameScreen] = useState(new Animated.Value(width - 40));
    const [wheelOpacity, setWheelOpacity] = useState(new Animated.Value(1));

    const numberOfSegments = texts.length;
    const fontSize = 20;
    const oneTurn = 360;
    const angleBySegment = oneTurn / numberOfSegments;
    const angleOffset = angleBySegment / 2;
    const [_angle, set_angle] = useState(new Animated.Value(0));

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

    const _wheelPaths = makeWheel();

    const _textRender = (x, y, number, i) => (
        <Text
            x={x - number.length * 5}
            y={y - 80}
            fill='#fff'
            textAnchor="middle"
            fontSize={fontSize}>
            {Array.from({ length: number.length }).map((_, j) => {
                // Render reward text vertically
                if ('asd' === 'vertical') {
                    return (
                        <TSpan x={x} dy={fontSize} key={`arc-${i}-slice-${j}`}>
                            {number.charAt(j)}
                        </TSpan>
                    );
                } else {
                    return (
                        <TSpan
                            y={y - 10}
                            dx={fontSize * 0.04}
                            key={`arc-${i}-slice-${j}`}>
                            {number.charAt(j)}
                        </TSpan>
                    );
                }
            })}
        </Text>
    );

    const _renderSvgWheel = () => (
        <View style={styles.wheelContainer}>
            <Animated.View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: [
                        {
                            rotate: _angle.interpolate({
                                inputRange: [-oneTurn, 0, oneTurn],
                                outputRange: [
                                    `-${oneTurn}deg`,
                                    `0deg`,
                                    `${oneTurn}deg`,
                                ],
                            }),
                        },
                    ],
                    backgroundColor: '#fff',
                    width: width - 20,
                    height: width - 20,
                    borderRadius: (width - 20) / 2,
                    borderWidth: 2,
                    opacity: wheelOpacity,
                }}>
                <AnimatedSvg
                    width={gameScreen}
                    height={gameScreen}
                    viewBox={`0 0 ${width} ${width}`}
                    style={{
                        transform: [{ rotate: `-${angleOffset}deg` }],
                        margin: 10,
                    }}>
                    <G y={width / 2} x={width / 2}>
                        {makeWheel().map((arc, i) => {
                            const [x, y] = arc.centroid;
                            const number = arc.value.toString();
                            return (
                                <G key={`arc-${i}`}>
                                    <Path d={arc.path} strokeWidth={2} fill={arc.color} />
                                    <G
                                        rotation={(i * oneTurn) / numberOfSegments + angleOffset}
                                        origin={`${x}, ${y}`}>
                                        {_textRender(x, y, number, i)}
                                    </G>
                                </G>
                            );
                        })}
                    </G>
                </AnimatedSvg>
            </Animated.View>
        </View>
    );

    const _onPress = () => {
        const duration = 10000;
        setStarted(true);
        const randomWinnerIndex = Math.floor(Math.random() * numberOfSegments);

        Animated.timing(_angle, {
            toValue: 365 - randomWinnerIndex * (oneTurn / numberOfSegments) + 360 * (duration / 1000),
            duration: duration,
            useNativeDriver: true,
        }).start(() => {
            setFinished(true);
            setWinner(_wheelPaths[randomWinnerIndex].value);
            console.log('Winner:', _wheelPaths[randomWinnerIndex].value);
            setStarted(false);
            set_angle(new Animated.Value(0));
        });
    };

    const _renderTopToPlay = () => {
        if (!started) {
            return (
                <TouchableOpacity onPress={_onPress}>
                    <View style={styles.button}>
                        <Textt style={styles.buttonText}>Çevir</Textt>
                    </View>
                </TouchableOpacity>
            );
        }
    };

    const _renderWinner = () => {
        if (finished) {
            return (
                <View style={styles.winnerContainer}>
                    <Textt style={styles.winnerText}>Kazanan: {winner}</Textt>
                </View>
            );
        }
    };

    return (
        <View style={styles.container}>
            {_renderSvgWheel()}
            {_renderTopToPlay()}
            {_renderWinner()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
    },
    wheelContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#6200ee',
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    winnerContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    winnerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default WheelSpin;
