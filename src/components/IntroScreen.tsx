import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

type IntroScreenProps = {
  onFinish: () => void;
};

export default function IntroScreen({ onFinish }: IntroScreenProps) {
  const [displayedText, setDisplayedText] = useState("");

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;

  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();

    const text = "Tik Time";
    let index = 0;

    const typingInterval = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1));
      index++;

      if (index === text.length) {
        clearInterval(typingInterval);
      }
    }, 120);

    const createDotAnimation = (
      animatedValue: Animated.Value,
      delay: number
    ) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animatedValue, {
            toValue: -8,
            duration: 220,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 220,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay(180),
        ])
      );
    };

    Animated.parallel([
      createDotAnimation(dot1, 0),
      createDotAnimation(dot2, 120),
      createDotAnimation(dot3, 240),
    ]).start();

    const finishTimer = setTimeout(onFinish, 2600);

    return () => {
      clearInterval(typingInterval);
      clearTimeout(finishTimer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <Animated.Image
          source={require("../../assets/logo.png")}
          style={[
            styles.logo,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
          resizeMode="contain"
        />

        <Text style={styles.title}>{displayedText}</Text>
        <Text style={styles.subtitle}>Track the moments that matter</Text>

        <View style={styles.dots}>
          <Animated.View
            style={[
              styles.dot,
              {
                transform: [{ translateY: dot1 }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.dot,
              {
                transform: [{ translateY: dot2 }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.dot,
              {
                transform: [{ translateY: dot3 }],
              },
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 38,
    fontWeight: "900",
    color: theme.colors.primary,
    letterSpacing: -1,
    minHeight: 46,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: theme.colors.mutedText,
    fontWeight: "600",
  },
  dots: {
    flexDirection: "row",
    gap: 7,
    marginTop: 28,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
    shadowColor: "#6a1bf4",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
});