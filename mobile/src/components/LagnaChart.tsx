import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Svg, { Line, Polygon } from 'react-native-svg';
import type { ChartData } from '../services/astrologyEngine';

export interface LagnaChartProps {
    chartData: ChartData;
    size?: number; // width and height of the chart
}

const PLANET_ABBR: Record<string, string> = {
    Sun: 'Su',
    Moon: 'Mo',
    Mars: 'Ma',
    Mercury: 'Me',
    Jupiter: 'Ju',
    Venus: 'Ve',
    Saturn: 'Sa',
    Rahu: 'Ra',
    Ketu: 'Ke',
};

// House centers based on 0-100 percentage system
const HOUSE_CENTERS = [
    { x: 50, y: 25 }, // 1
    { x: 25, y: 12 }, // 2
    { x: 12, y: 25 }, // 3
    { x: 25, y: 50 }, // 4
    { x: 12, y: 75 }, // 5
    { x: 25, y: 88 }, // 6
    { x: 50, y: 75 }, // 7
    { x: 75, y: 88 }, // 8
    { x: 88, y: 75 }, // 9
    { x: 75, y: 50 }, // 10
    { x: 88, y: 25 }, // 11
    { x: 75, y: 12 }, // 12
];

const SIGN_POSITIONS = [
    { x: 45, y: 10 }, // 1
    { x: 38, y: 4 },  // 2
    { x: 4, y: 38 }, // 3
    { x: 40, y: 44 }, // 4
    { x: 4, y: 62 }, // 5
    { x: 38, y: 96 }, // 6
    { x: 55, y: 90 }, // 7
    { x: 62, y: 96 }, // 8
    { x: 96, y: 62 }, // 9
    { x: 60, y: 56 }, // 10
    { x: 96, y: 38 }, // 11
    { x: 62, y: 4 },  // 12
];

export const LagnaChart: React.FC<LagnaChartProps> = ({ chartData, size = 320 }) => {
    const theme = useTheme();

    // Draw the framework using Svg
    // The North Indian style chart lines:
    // Outer rectangle: (0,0) to (100,0) to (100,100) to (0,100) to (0,0)
    // Diagonals: (0,0) to (100,100), and (100,0) to (0,100)
    // Diamonds: (50,0) to (100,50) to (50,100) to (0,50) to (50,0)

    // Premium cosmic theme colors similar to industry standard (AstroSage dark theme)
    const chartBg = theme.dark ? theme.colors.elevation.level2 : '#302E38';
    const strokeColor = theme.dark ? theme.colors.primary : '#A695E5';
    const strokeWidth = 2; // Slightly thicker for a premium feel
    const textColor = '#FFFFFF';
    const signColor = '#A695E5';

    const getHouseContent = (houseNum: number) => {
        // get all planets in this house
        const planetsInHouse = chartData.planets.filter(p => p.house === houseNum);
        const planetLabels = planetsInHouse.map(p => PLANET_ABBR[p.planet] || p.planet.substring(0, 2)).join(', ');

        // sign number for this house
        // lagnaSignIndex is 0-based. So lagna sign number = index + 1
        const signNum = ((chartData.lagnaSignIndex + houseNum - 1) % 12) + 1;

        return { planetLabels, signNum };
    };

    return (
        <View style={[styles.container, { width: size, height: size, backgroundColor: chartBg }]}>
            <Svg width="100%" height="100%" viewBox="0 0 100 100">
                {/* Outer Bound Square */}
                <Polygon
                    points="0,0 100,0 100,100 0,100"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                />

                {/* Main Full Diagonals (X) */}
                <Line x1="0" y1="0" x2="100" y2="100" stroke={strokeColor} strokeWidth={strokeWidth} />
                <Line x1="100" y1="0" x2="0" y2="100" stroke={strokeColor} strokeWidth={strokeWidth} />

                {/* Inner Diamond (Connecting 4 midpoints of the outer square) */}
                <Polygon
                    points="50,0 100,50 50,100 0,50"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                />
            </Svg>

            {/* Text overlays for each of the 12 houses */}
            {HOUSE_CENTERS.map((center, index) => {
                const houseNum = index + 1;
                const { planetLabels, signNum } = getHouseContent(houseNum);

                return (
                    <React.Fragment key={`house-${houseNum}`}>
                        {/* Planets */}
                        <View
                            style={[
                                styles.houseCenter,
                                { left: `${center.x}%`, top: `${center.y}%`, transform: [{ translateX: '-50%' }, { translateY: '-50%' }] }
                            ]}
                            pointerEvents="none"
                        >
                            <Text
                                style={{
                                    color: textColor,
                                    fontWeight: '700',
                                    textAlign: 'center',
                                    fontSize: Math.max(11, size * 0.035)
                                }}
                            >
                                {planetLabels}
                            </Text>
                        </View>

                        {/* Zodiac Sign Number */}
                        <View
                            style={[
                                styles.signNumPos,
                                { left: `${SIGN_POSITIONS[index].x}%`, top: `${SIGN_POSITIONS[index].y}%`, transform: [{ translateX: '-50%' }, { translateY: '-50%' }] }
                            ]}
                            pointerEvents="none"
                        >
                            <Text
                                style={{
                                    color: signColor,
                                    fontWeight: '600',
                                    fontSize: Math.max(9, size * 0.028)
                                }}
                            >
                                {signNum}
                            </Text>
                        </View>
                    </React.Fragment>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
        marginVertical: 16,
        ...Platform.select({
            web: {
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.1)'
            }
        })
    },
    houseCenter: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: '30%',
        height: '25%',
    },
    signNumPos: {
        position: 'absolute',
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
