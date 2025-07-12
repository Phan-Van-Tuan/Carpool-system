import React from "react";
import {
  Modal as RNModal,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { X } from "lucide-react-native";
import { getColors } from "@/constants/color";
import layout from "@/constants/layout";
import { Text } from "./Text";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  closeOnBackdropPress?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  avoidKeyboard?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  footer,
  showCloseButton = true,
  closeOnBackdropPress = true,
  style,
  contentStyle,
  avoidKeyboard = true,
}) => {
  const { theme } = useThemeStore();
  const colors = getColors(theme);

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  const modalContent = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.theme.backdrop,
        },
      ]}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View
        style={[
          styles.content,
          {
            backgroundColor: colors.theme.background,
            borderColor: colors.theme.border,
          },
          contentStyle,
        ]}
      >
        {(title || showCloseButton) && (
          <View style={styles.header}>
            {title && (
              <Text variant="h3" color={colors.theme.text}>
                {title}
              </Text>
            )}
            {showCloseButton && (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color={colors.theme.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        )}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>

        {footer && <View style={styles.footer}>{footer}</View>}
      </View>
    </View>
  );

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {avoidKeyboard && Platform.OS !== "web" ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={[styles.keyboardAvoid, style]}
        >
          {modalContent}
        </KeyboardAvoidingView>
      ) : (
        <View style={[styles.keyboardAvoid, style]}>{modalContent}</View>
      )}
    </RNModal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    width: "90%",
    maxWidth: 500,
    maxHeight: "80%",
    borderRadius: layout.borderRadius.large,
    borderWidth: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: layout.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  closeButton: {
    padding: layout.spacing.xs,
  },
  scrollContent: {
    padding: layout.spacing.m,
  },
  footer: {
    padding: layout.spacing.m,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
});
