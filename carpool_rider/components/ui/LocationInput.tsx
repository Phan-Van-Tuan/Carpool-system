import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { Text } from "./Text";
import { Input } from "./Input";
import { Card } from "./Card";
import { MapPin, Search, X } from "lucide-react-native";
import { getColors } from "@/constants/color";
import { useTranslation } from "@/constants/i18n";
import layout from "@/constants/layout";
import { api } from "@/services/api";
import { PlacePrediction } from "@/types/extend";
import { GeoJson } from "@/types/base";
import { toGeoJson, toRgba } from "@/lib/utils";

interface LocationInputProps {
  value: string;
  onLocationSelect: (location: GeoJson) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

export function LocationInput({
  value,
  onLocationSelect,
  placeholder,
  label,
  error,
}: LocationInputProps) {
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { t } = useTranslation();

  const [searchText, setSearchText] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchResults, setSearchResults] = useState<PlacePrediction[]>([]);

  useEffect(() => {
    if (value) {
      setSearchText(value);
    }
  }, [value]);

  const handleSearch = () => {
    if (searchText.length > 2) {
      fetchSuggestions(searchText);
    }
  };

  const fetchSuggestions = async (query: string) => {
    try {
      const predictions = await api.map.autoComplete(query);
      // console.log("search location: " + query);
      setSearchResults(predictions);
      setShowResults(true);
    } catch (error) {
      console.error("Error:", error);
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleSelectLocation = async (location: PlacePrediction) => {
    const res = await api.map.getDetail(location.place_id);
    onLocationSelect({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          res.result.geometry.location.lng,
          res.result.geometry.location.lat,
        ],
      },
      properties: {
        id: res.result.place_id,
        name: res.result.name,
        description: res.result.formatted_address,
      },
    });
    setSearchText(location.description);
    setShowResults(false);
    setShowModal(false);
  };

  const handleClear = () => {
    setSearchText("");
    setShowModal(false);
    setShowResults(false);
    // onLocationSelect();
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text
          variant="bodySmall"
          color={colors.theme.textSecondary}
          style={styles.label}
        >
          {label}
        </Text>
      )}

      {/* <View style={styles.inputContainer}> */}
      <View>
        <Input
          value={searchText}
          onChangeText={(val) => {
            console.log(searchText);
            setSearchText(val);
          }}
          placeholder={placeholder || t("booking.enterLocation")}
          leftIcon={<MapPin size={20} color={colors.theme.textSecondary} />}
          rightIcon={
            searchText ? (
              <TouchableOpacity
                // onPress={handleClear}
                onPress={() => {
                  handleSearch();
                  setShowModal(true);
                }}
              >
                <Search size={20} color={colors.theme.textSecondary} />
              </TouchableOpacity>
            ) : null
          }
          // onFocus={() => {
          //   setShowModal(true);
          //   // if (searchText.length > 0) {
          //   //   setShowResults(true);
          //   // }
          // }}
          focusable={false}
          error={error}
        />
      </View>

      <Modal visible={showModal} style={styles.modal} animationType="slide">
        <View style={styles.modalOverlay}>
          {/* <Input
            value={searchText}
            onChangeText={handleSearch}
            placeholder={placeholder || t("booking.enterLocation")}
            leftIcon={<MapPin size={20} color={colors.theme.textSecondary} />}
            rightIcon={
              <TouchableOpacity onPress={handleClear}>
                <X size={20} color={colors.theme.textSecondary} />
              </TouchableOpacity>
            }
            onFocus={() => {
              if (searchText.length > 0) {
                setShowResults(true);
              }
            }}
            error={error}
          /> */}
          {showResults && searchResults.length > 0 && (
            <Card variant="elevated" style={styles.resultsContainer}>
              <FlatList
                data={searchResults}
                keyExtractor={(item, index) => `location-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.resultItem}
                    onPress={() => handleSelectLocation(item)}
                  >
                    <MapPin size={20} color={colors.theme.textSecondary} />
                    <View style={styles.resultTextContainer}>
                      <Text variant="body" color={colors.theme.text}>
                        {item.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<Text>Empty</Text>}
                style={styles.resultsList}
              />
            </Card>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  label: {
    marginBottom: layout.spacing.xs,
  },
  inputContainer: {
    position: "relative",
  },
  resultsContainer: {
    position: "absolute",
    top: "10%",
    left: 0,
    right: 0,
    zIndex: 10,
    maxHeight: 300,
    margin: layout.spacing.m,
    padding: 0,
  },
  resultsList: {
    flexGrow: 0,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: layout.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  resultTextContainer: {
    marginLeft: layout.spacing.m,
    flex: 1,
  },
  modal: {
    maxHeight: 700,
    backgroundColor: "red",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: layout.spacing.m,
  },
});
