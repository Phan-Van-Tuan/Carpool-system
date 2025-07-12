import { getColors } from "@/constants/color";
import { useThemeStore } from "@/store/themeStore";
import { Calendar, Clock } from "lucide-react-native";
import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  View,
  Button,
} from "react-native";
import { Text } from "./Text";
import { useTranslation } from "@/constants/i18n";
import layout from "@/constants/layout";
import { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface PickerProp {
  value: Date | null;
  onSelect: (date: Date) => void;
  placeholder: string;
  label: string;
}

export default function DateTimePicker({
  value,
  onSelect,
  placeholder,
  label,
}: PickerProp) {
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { t } = useTranslation();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <Text
        variant="bodySmall"
        color={colors.theme.textSecondary}
        style={styles.label}
      >
        {label}
      </Text>
      <TouchableOpacity
        style={[
          styles.dateSelector,
          {
            borderColor: colors.theme.border,
            backgroundColor: colors.theme.background,
          },
        ]}
        onPress={() => {
          setShowDatePicker(true);
          // const tomorrow = new Date();
          // tomorrow.setDate(tomorrow.getDate() + 1);
          // onSelect(tomorrow);
        }}
      >
        <Calendar size={20} color={colors.theme.textSecondary} />
        <Text variant="body" color={colors.theme.text} style={styles.dateText}>
          {value != null ? formatDate(new Date(value)) : placeholder}
        </Text>
        <Clock size={20} color={colors.theme.textSecondary} />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={showDatePicker}
        minimumDate={new Date(new Date().getTime() + 60 * 60 * 1000)}
        mode="datetime"
        minuteInterval={15}
        onConfirm={(date) => {
          onSelect(date);
          setShowDatePicker(false);
        }}
        onCancel={() => {
          setShowDatePicker(false);
        }}
      />
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    marginBottom: layout.spacing.xs,
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: layout.borderRadius.medium,
    padding: layout.spacing.m,
    marginBottom: layout.spacing.m,
  },
  dateText: {
    flex: 1,
    marginLeft: layout.spacing.m,
    marginRight: layout.spacing.m,
  },
});
