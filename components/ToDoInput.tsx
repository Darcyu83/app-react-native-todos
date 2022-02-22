import React from "react";
import { StyleSheet, TextInput } from "react-native";

interface IProps {
  textTyped: string;
  isWorkShowedLast: boolean | undefined;
  onChangeText: (text: string) => void;
  addToDo: () => Promise<void>;
}
export default function ToDoInput({
  isWorkShowedLast,
  textTyped,
  onChangeText,
  addToDo,
}: IProps) {
  return (
    <TextInput
      onSubmitEditing={addToDo}
      style={styles.input}
      returnKeyType="done"
      onChangeText={onChangeText}
      value={textTyped}
      placeholder={isWorkShowedLast ? "Add a To Do" : "Where do you want to go"}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
});
