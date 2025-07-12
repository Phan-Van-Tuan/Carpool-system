import { LanguageCode } from "@/contexts/LanguageContext";
import React, { useState, useEffect, ReactNode } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  TextInput,
  FlatList,
  StatusBar,
} from "react-native";

// Types
interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode;
  footerButtons?: Array<{
    text: string;
    onPress: () => void;
    type?: "primary" | "secondary";
  }>;
}

interface SelectionItemProps {
  code: string;
  name: string;
}

interface LanguageSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (language: LanguageCode) => void;
  languages: SelectionItemProps[];
  selectedLanguage?: string;
}

// Custom Modal Base Component
export const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  onClose,
  title,
  children,
  footerButtons,
}) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, animation]);

  const backdropAnimatedStyle = {
    opacity: animation,
  };

  const modalAnimatedStyle = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
  };

  if (!isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.backdrop, backdropAnimatedStyle]} />
          <Animated.View style={[styles.modalContainer, modalAnimatedStyle]}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{title}</Text>
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.modalBody}>{children}</View>
                {footerButtons && footerButtons.length > 0 && (
                  <View style={styles.modalFooter}>
                    {footerButtons.map((button, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.button,
                          button.type === "secondary"
                            ? styles.secondaryButton
                            : styles.primaryButton,
                        ]}
                        onPress={button.onPress}
                      >
                        <Text
                          style={[
                            styles.buttonText,
                            button.type === "secondary"
                              ? styles.secondaryButtonText
                              : styles.primaryButtonText,
                          ]}
                        >
                          {button.text}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// Language Selection Modal Component
export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  isVisible,
  onClose,
  onSelect,
  languages,
  selectedLanguage,
}) => {
  const [searchText, setSearchText] = useState("");
  const [filteredLanguages, setFilteredLanguages] = useState(languages);

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredLanguages(languages);
    } else {
      const filtered = languages.filter((lang) =>
        lang.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredLanguages(filtered);
    }
  }, [searchText, languages]);

  const handleSelectLanguage = (language: SelectionItemProps) => {
    onSelect(language.code as LanguageCode);
    onClose();
  };

  const renderLanguageItem = ({ item }: { item: SelectionItemProps }) => (
    <TouchableOpacity
      style={[
        styles.selectionItem,
        selectedLanguage === item.code && styles.selectedItem,
      ]}
      onPress={() => handleSelectLanguage(item)}
    >
      <Text style={styles.selectionItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <CustomModal isVisible={isVisible} onClose={onClose} title="Chọn ngôn ngữ">
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm ngôn ngữ..."
          value={searchText}
          onChangeText={setSearchText}
          clearButtonMode="while-editing"
          autoCapitalize="none"
        />
      </View>
      <FlatList
        data={filteredLanguages}
        renderItem={renderLanguageItem}
        keyExtractor={(item) => item.code.toString()}
        style={styles.selectionList}
        showsVerticalScrollIndicator={false}
      />
    </CustomModal>
  );
};

// Input Modal Example
interface InputModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  initialValue?: string;
  placeholder?: string;
  title: string;
}

export const InputModal: React.FC<InputModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  initialValue = "",
  placeholder = "Nhập thông tin...",
  title,
}) => {
  const [inputValue, setInputValue] = useState(initialValue);

  const handleSubmit = () => {
    onSubmit(inputValue);
    onClose();
  };

  useEffect(() => {
    if (isVisible) {
      setInputValue(initialValue);
    }
  }, [isVisible, initialValue]);

  return (
    <CustomModal
      isVisible={isVisible}
      onClose={onClose}
      title={title}
      footerButtons={[
        {
          text: "Hủy",
          onPress: onClose,
          type: "secondary",
        },
        {
          text: "Xác nhận",
          onPress: handleSubmit,
          type: "primary",
        },
      ]}
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={placeholder}
          autoFocus
          multiline
        />
      </View>
    </CustomModal>
  );
};

// Styles
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
  },
  modalContent: {
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#f8f9fa",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333333",
  },
  closeButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#666666",
    fontWeight: "500",
  },
  modalBody: {
    maxHeight: height * 0.6,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e0e0e0",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
    minWidth: 80,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#3498db",
  },
  secondaryButton: {
    backgroundColor: "#f1f3f5",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "500",
  },
  primaryButtonText: {
    color: "white",
  },
  secondaryButtonText: {
    color: "#333333",
  },
  searchContainer: {
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
  },
  searchInput: {
    backgroundColor: "#f0f2f5",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  selectionList: {
    maxHeight: 300,
  },
  selectionItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eeeeee",
  },
  selectedItem: {
    backgroundColor: "#e6f3ff",
  },
  selectionItemText: {
    fontSize: 16,
    color: "#333333",
  },
  inputContainer: {
    padding: 15,
  },
  textInput: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
});

// // Usage Example
// export const ModalExample: React.FC = () => {
//   const [languageModalVisible, setLanguageModalVisible] = useState(false);
//   const [inputModalVisible, setInputModalVisible] = useState(false);
//   const [selectedLanguage, setSelectedLanguage] = useState<SelectionItemProps>({
//     id: "vi",
//     label: "Tiếng Việt",
//     value: "vi",
//   });
//   const [inputText, setInputText] = useState("");

//   const languages: SelectionItemProps[] = [
//     { id: "vi", label: "Tiếng Việt", value: "vi" },
//     { id: "en", label: "English", value: "en" },
//     { id: "fr", label: "Français", value: "fr" },
//     { id: "ja", label: "日本語", value: "ja" },
//     { id: "ko", label: "한국어", value: "ko" },
//     { id: "zh", label: "中文", value: "zh" },
//   ];

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <StatusBar backgroundColor="#fff" barStyle="dark-content" />

//       {/* Language Selection Button */}
//       <TouchableOpacity
//         style={styles.primaryButton}
//         onPress={() => setLanguageModalVisible(true)}
//       >
//         <Text style={styles.primaryButtonText}>
//           Chọn ngôn ngữ: {selectedLanguage.label}
//         </Text>
//       </TouchableOpacity>

//       {/* Input Modal Button */}
//       <TouchableOpacity
//         style={[styles.primaryButton, { marginTop: 20 }]}
//         onPress={() => setInputModalVisible(true)}
//       >
//         <Text style={styles.primaryButtonText}>Mở modal nhập liệu</Text>
//       </TouchableOpacity>

//       {/* Display input text if any */}
//       {inputText ? (
//         <View style={{ marginTop: 20, padding: 10 }}>
//           <Text>Nội dung đã nhập: {inputText}</Text>
//         </View>
//       ) : null}

//       {/* Language Selection Modal */}
//       <LanguageSelectionModal
//         isVisible={languageModalVisible}
//         onClose={() => setLanguageModalVisible(false)}
//         onSelect={setSelectedLanguage}
//         languages={languages}
//         selectedLanguage={selectedLanguage}
//       />

//       {/* Input Modal */}
//       <InputModal
//         isVisible={inputModalVisible}
//         onClose={() => setInputModalVisible(false)}
//         onSubmit={setInputText}
//         initialValue={inputText}
//         placeholder="Nhập nội dung của bạn..."
//         title="Nhập thông tin"
//       />
//     </View>
//   );
// };
