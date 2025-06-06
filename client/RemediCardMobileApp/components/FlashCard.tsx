import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated, Image } from "react-native";

interface FlashcardProps {
    question: string;
    frontImageURL: string;
    answer: string;
    backImageURL: string;
    width?: number;
    height?: number;
    textSize?: number;
    longPressHandler?: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({
    question,
    frontImageURL,
    answer,
    backImageURL,
    width = 300,
    height = 200,
    textSize = 20,
    longPressHandler = () => {}
}) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const flipAnim = useRef(new Animated.Value(0)).current;

    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ["0deg", "180deg"],
    });

    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ["180deg", "360deg"],
    });

    const flipCard = () => {
        if (isAnimating) return; // Prevent multiple triggers during animation

        setIsAnimating(true);
        if (isFlipped) {
            Animated.timing(flipAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setIsFlipped(false);
                setIsAnimating(false); // Unlock animation
            });
        } else {
            Animated.timing(flipAnim, {
                toValue: 180,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setIsFlipped(true);
                setIsAnimating(false);
            });
        }
    };

    return (
        <TouchableWithoutFeedback onPress={flipCard} onLongPress={longPressHandler}>
            <View style={[styles.cardContainer, { width, height }]}>
                <Animated.View
                    style={[
                        styles.card,
                        styles.front,
                        { width, height, transform: [{ rotateY: frontInterpolate }] },
                    ]}
                >
                    {frontImageURL && 
                        <Image
                            source={{ uri: frontImageURL}}
                            style={{ width: "80%", height: "80%", borderRadius: 10 }}
                        />
                    }
                    <Text style={[styles.text, { fontSize: textSize }]}>{question}</Text>
                </Animated.View>

                <Animated.View
                    style={[
                        styles.card,
                        styles.back,
                        { width, height, transform: [{ rotateY: backInterpolate }] },
                    ]}
                >
                    {backImageURL && 
                        <Image
                            source={{ uri: backImageURL}}
                            style={{ width: "80%", height: "80%", borderRadius: 10 }}
                        />
                    }
                    <Text style={[styles.text, { fontSize: textSize }]}>{answer}</Text>
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default Flashcard;

const styles = StyleSheet.create({
    cardContainer: {
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    card: {
        alignItems: "center",
        justifyContent: "center",
        backfaceVisibility: "hidden",
        position: "absolute",
        borderRadius: 20,
    },
    front: {
        backgroundColor: "#FFFF",
    },
    back: {
        backgroundColor: "#C2E1FF",
        transform: [{ rotateY: "180deg" }],
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111",
        textAlign: "center",
    },
});
