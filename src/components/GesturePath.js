import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import Svg, { Polyline } from 'react-native-svg';

const GesturePath = ({ path, color }) => {
    const { width, height } = Dimensions.get('window');
    const points = path.map(p => `${p.x},${p.y}`).join(' ');
    return (
        <Svg height="100%" width="100%" viewBox={`0 0 ${width} ${height}`}>
            <Polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="1"
            />
        </Svg>
    );
};

export default GesturePath;