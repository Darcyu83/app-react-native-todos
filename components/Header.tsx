import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../colors";

interface IProps {
  isWorkShownLast: boolean | undefined;
  work: () => void;
  travel: () => void;
}
export default function Header({ isWorkShownLast, work, travel }: IProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={work}>
        <Text
          style={[
            styles.btnText,
            {
              color:
                // isWorkShownLast === undefined
                //   ? ""
                isWorkShownLast ? "white" : theme.grey,
            },
          ]}
        >
          Work
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={travel}>
        <Text
          style={[
            styles.btnText,
            {
              color:
                // isWorkShownLast === undefined
                //   ? ""
                !isWorkShownLast ? "white" : theme.grey,
            },
          ]}
        >
          Travel
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
  },
  btnText: { fontSize: 38, fontWeight: "600" },
});
