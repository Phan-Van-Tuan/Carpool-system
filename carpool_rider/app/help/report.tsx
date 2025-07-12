import React from "react";
import { View, Text } from "react-native";

export default function HelpReportScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Report an Issue</Text>
      <Text>Please describe the issue you are facing:</Text>
      {/* Add a TextInput or other components for user input */}
    </View>
  );
}
