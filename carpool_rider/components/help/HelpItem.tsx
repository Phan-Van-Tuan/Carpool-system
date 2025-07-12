import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getColors } from "@/constants/color";
import { Text, Card } from "@/components/ui";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import layout from "@/constants/layout";

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface HelpItemProps {
  question: string;
  answer: string;
}

export function HelpItem({ question, answer }: HelpItemProps) {
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <Card variant="flat" style={styles.container}>
      <TouchableOpacity
        style={styles.questionContainer}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <Text
          variant="body"
          color={colors.theme.text}
          weight="600"
          style={styles.question}
        >
          {question}
        </Text>
        {expanded ? (
          <ChevronUp size={20} color={colors.theme.textSecondary} />
        ) : (
          <ChevronDown size={20} color={colors.theme.textSecondary} />
        )}
      </TouchableOpacity>

      {expanded && (
        <View style={styles.answerContainer}>
          <Text
            variant="body"
            color={colors.theme.textSecondary}
            style={styles.answer}
          >
            {answer}
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: layout.spacing.m,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: layout.spacing.m,
  },
  question: {
    flex: 1,
    marginRight: layout.spacing.m,
  },
  answerContainer: {
    padding: layout.spacing.m,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  answer: {
    lineHeight: 22,
  },
});
