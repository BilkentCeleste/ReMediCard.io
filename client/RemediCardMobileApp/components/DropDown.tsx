import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { ChevronDown } from "@/constants/icons";

// Define the prop types
interface DropDownProps {
  options: { label: string; value: string }[];
  placeholder?: string;
  onSelect: (value: string) => void;
}

const DropDown: React.FC<DropDownProps> = ({
  options,
  placeholder = "Select an option",
  onSelect,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string>(placeholder);

  const handleSelect = (value: string, label: string) => {
    setSelectedLabel(label);
    setIsVisible(false);
    onSelect(value);
  };

  return (
    <View style={styles.container}>
      {/* Dropdown Button */}
      <TouchableOpacity
        style={styles.menuComponent}
        onPress={() => setIsVisible(!isVisible)}
      >
        <Text style={styles.menuText}>{selectedLabel}</Text>
        <View style={[styles.chevronRightIcon, styles.iconLayout]}>
          <ChevronDown/>
        </View>
        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
        </View>
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal visible={isVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setIsVisible(false)}
        />
        <View style={styles.dropdown}>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleSelect(item.value, item.label)}
              >
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 0,
  },
  menuComponent: {
    width: "75%",
    height: 20,
    padding: 10,
    gap: 10,
    alignItems: "center",
    marginVertical: 5,
  },
  menuText: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: "Inter-Regular",
    color: "#fff",
    textAlign: "left",
    zIndex: 1,
    top: 5,
    position: "absolute",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#fff",
  },
  iconLayout: {
    height: 24,
    width: 24,
    position: "absolute",
  },
  chevronRightIcon: {
    left: "95%",
    zIndex: 3,
    top: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dropdown: {
    position: "absolute",
    top: "50%",
    left: "10%",
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    elevation: 5,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
    color: "black",
  },
});

export default DropDown;
