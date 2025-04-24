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
}

const Flashcard: React.FC<FlashcardProps> = ({
    question,
    frontImageURL,
    answer,
    backImageURL,
    width = 300, // Default width
    height = 200, // Default height
    textSize = 20
}) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false); // Animation state
    const flipAnim = useRef(new Animated.Value(0)).current;

    // Interpolations for flipping
    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ["0deg", "180deg"],
    });

    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ["180deg", "360deg"],
    });

    // Flip Animation with Animation Lock
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
                setIsAnimating(false); // Unlock animation
            });
        }
    };

    return (
        <TouchableWithoutFeedback onPress={flipCard}>
            <View style={[styles.cardContainer, { width, height }]}>
                {/* Front Face */}
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
                            style={{ width: 200, height: 200, borderRadius: 10 }}
                        />
                    }
                    <Text style={[styles.text, { fontSize: textSize }]}>{question}</Text>
                </Animated.View>

                {/* Back Face */}
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
                            style={{ width: 200, height: 200, borderRadius: 10 }}
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
        position: "relative", // Enables stacking front and back faces
    },
    card: {
        alignItems: "center",
        justifyContent: "center",
        backfaceVisibility: "hidden", // Prevents showing the reverse side
        position: "absolute", // Stack on top of each other
        borderRadius: 20,
    },
    front: {
        backgroundColor: "#FFFF",
    },
    back: {
        backgroundColor: "#C2E1FF",
        transform: [{ rotateY: "180deg" }], // Pre-rotated for back face
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111",
        textAlign: "center",
    },
});
