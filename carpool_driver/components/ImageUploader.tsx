import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextStyle,
  ViewStyle,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { PlusCircle, XCircle } from "lucide-react-native";
import Layout from "@/constants/layout";

type ImageUploaderProps = {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  itemStyle?: ViewStyle;
  errorStyle?: TextStyle;
  colors: any;
  onImagesChange: (images: string[]) => void;
  multiple?: boolean; // Mặc định là single nếu không truyền
  require?: boolean;
  initialImages?: string[];
};

const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  error,
  containerStyle,
  labelStyle,
  itemStyle,
  errorStyle,
  colors,
  require = false,
  onImagesChange,
  multiple = false,
  initialImages = [],
}) => {
  const [images, setImages] = useState<string[]>(initialImages);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: multiple,
        quality: 0.8, // Giảm xuống để tối ưu hiệu suất
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset) => asset.uri);
        const updatedImages = multiple
          ? [...images, ...newImages]
          : [newImages[0]]; // Nếu single thì chỉ giữ 1 ảnh
        setImages(updatedImages);
        onImagesChange(updatedImages);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text
          style={[styles.label, { color: colors.textSecondary }, labelStyle]}
        >
          {label} {require && <Text style={{ color: colors.danger }}>*</Text>}
        </Text>
      )}

      <View
        style={[
          styles.container,
          {
            borderColor: error ? colors.danger : colors.border,
            backgroundColor: colors.darkGray,
          },
          containerStyle,
        ]}
      >
        <ScrollView
          horizontal={multiple}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              width: images.length !== 0 ? "auto" : "100%",
            },
          ]}
        >
          {images.map((img, index) => (
            <View
              key={index}
              style={[
                styles.imageContainer,
                {
                  backgroundColor: colors.background,
                  width: multiple ? Layout.spacing.xxl * 4.8 : "100%",
                },
                itemStyle,
              ]}
            >
              <Image
                source={{ uri: img }}
                style={styles.image}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => removeImage(index)}
                style={[
                  styles.removeButton,
                  { backgroundColor: colors.background },
                ]}
              >
                <XCircle size={20} color={colors.danger} />
              </TouchableOpacity>
            </View>
          ))}

          {(multiple || images.length === 0) && (
            <TouchableOpacity
              onPress={pickImage}
              style={[
                styles.addButton,
                {
                  flex: 1,
                  width:
                    images.length === 0 ? "100%" : Layout.spacing.xxl * 4.8,
                },
              ]}
            >
              <PlusCircle size={30} color={colors.gray} />
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {error && (
        <Text style={[styles.errorText, { color: colors.danger }, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    fontWeight: "500",
  },
  container: {
    minHeight: Layout.spacing.xxl * 5,
    borderWidth: 1,
    borderRadius: Layout.borderRadius.medium,
    overflow: "hidden",
  },
  scrollContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: Layout.spacing.s,
    gap: Layout.spacing.s,
  },
  imageContainer: {
    height: Layout.spacing.xxl * 4.6,
    borderRadius: Layout.borderRadius.medium,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: Layout.borderRadius.medium,
  },
  removeButton: {
    position: "absolute",
    top: -5,
    right: -5,
    borderRadius: Layout.borderRadius.round,
    zIndex: 10,
  },
  addButton: {
    height: Layout.spacing.xxl * 4.6,
    borderRadius: Layout.borderRadius.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 12,
    marginTop: Layout.spacing.s,
  },
});

export default ImageUploader;
