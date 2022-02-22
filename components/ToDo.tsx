import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../colors";
import { IToDos } from "../type";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

interface IProps {
  toDos: IToDos;
  todoKey: string;
  idx: number;
  modifiedKey: string;
  textTypedToModi: string;
  openModInput: (key: string, text: string) => void;
  updateToDo: (key: string) => void;
  onChangeTextToModi: (text: string) => void;
  addToDoBack: (key: string) => void;
  completeToDo: (key: string) => void;
  deleteToDo: (key: string) => void;
}

export default function ToDo({
  toDos,
  todoKey,
  modifiedKey,
  textTypedToModi,
  openModInput,
  updateToDo,
  onChangeTextToModi,
  addToDoBack,
  completeToDo,
  deleteToDo,
}: IProps) {
  if (!toDos) return <Text> no Data </Text>;
  return (
    <View
      style={
        modifiedKey !== todoKey
          ? styles.toDo
          : [styles.toDo, { backgroundColor: theme.modalBg }]
      }
    >
      <View style={styles.textArea}>
        <Pressable
          key={todoKey}
          onPress={() => openModInput(todoKey, toDos[todoKey].text)}
        >
          <Text
            style={[
              styles.toDoText,
              toDos[todoKey].done ? { color: "black" } : {},
            ]}
          >
            {toDos[todoKey].text}
          </Text>
        </Pressable>
      </View>

      <View style={styles.btns}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            toDos[todoKey].done ? addToDoBack(todoKey) : completeToDo(todoKey)
          }
        >
          <MaterialIcons
            name={toDos[todoKey].done ? "add-task" : "check-circle-outline"}
            size={20}
            color={theme.grey}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => deleteToDo(todoKey)}
        >
          <AntDesign name="delete" size={20} color={theme.grey} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toDo: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  textArea: {
    flex: 8,
    width: "100%",
  },
  toDoText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
  btns: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignContent: "center",
  },
  btn: {
    marginHorizontal: 5,
  },
});
