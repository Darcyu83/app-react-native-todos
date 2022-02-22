import { StatusBar } from "expo-status-bar";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { theme } from "./colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";

interface IToDos {
  [key: string]: { text: string; working: boolean };
}

const icons: { [key: string]: "delete" } = {
  delete: "delete" as const,
};
const STORAGE_KEY = "@toDos";
export default function App() {
  const [working, setWorking] = useState(true);
  const [textTyped, setTextTyped] = useState("");
  const [toDos, setToDos] = useState<IToDos>({});
  const [isLoading, setIsLoading] = useState(true);
  const [modifiedKey, setModifiedKey] = useState("");
  const [textTypedToModi, setTextTypedToModi] = useState("");
  const [inputIdx, setInputsIdx] = useState(-1);

  const inputs = useRef<TextInput[]>([]);
  useEffect(() => {
    loadToDos();
  }, []);

  const travel = () => {
    setWorking(false);
  };
  const work = () => setWorking(true);
  const onChangeText = (text: string) => {
    setTextTyped(text);
  };
  const onChangeTextToModi = (text: string) => {
    setTextTypedToModi(text);
  };
  const addToDo = async () => {
    if (textTyped === "") {
      return;
    }

    const newTodo = { ...toDos, [Date.now()]: { text: textTyped, working } };

    setToDos((curr) => newTodo);
    await saveToDos({
      ...toDos,
      ...newTodo,
    });
    setTextTyped("");
  };

  const deleteToDo = async (key: string) => {
    Alert.alert("Delete", "Are you sure to delete of it?", [
      { text: "취소" },
      {
        text: "지우기",
        onPress: async () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          await saveToDos(newToDos);
        },
      },
    ]);
  };
  const saveToDos = async (value: IToDos) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      s && setToDos(JSON.parse(s));
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const modifyToDo = (key: string, text: string, idx: number) => {
    setModifiedKey(key);
    setTextTypedToModi(text);
    setInputsIdx(idx);
  };

  const updateToDo = (key: string) => {
    const newToDos = {
      ...toDos,
      [key]: { ...toDos[key], text: textTypedToModi },
    };
    setToDos(newToDos);
    saveToDos(newToDos);
    setModifiedKey("");
  };

  useEffect(() => {
    if (inputIdx !== -1) inputs.current[inputIdx];
  }, [modifiedKey]);

  return (
    <View style={[styles.container]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={[styles.btnText, { color: working ? "white" : theme.grey }]}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={[styles.btnText, { color: !working ? "white" : theme.grey }]}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.scrollContainer]}>
        <TextInput
          onSubmitEditing={addToDo}
          style={styles.input}
          returnKeyType="done"
          onChangeText={onChangeText}
          value={textTyped}
          placeholder={working ? "Add a To Do" : "Where do you want to go"}
        />
        <ScrollView>
          {Object.keys(toDos).map((key, idx) =>
            working === toDos[key].working ? (
              <TouchableOpacity
                key={idx}
                onPress={() => modifyToDo(key, toDos[key].text, idx)}
              >
                <View
                  style={
                    modifiedKey !== key
                      ? styles.toDo
                      : [styles.toDo, { backgroundColor: "white" }]
                  }
                >
                  {modifiedKey === key ? (
                    <TextInput
                      ref={(el) => (el ? (inputs.current[idx] = el) : null)}
                      returnKeyType="done"
                      onSubmitEditing={() => updateToDo(key)}
                      style={styles.toDoTextInput}
                      value={textTypedToModi}
                      onChangeText={onChangeTextToModi}
                    />
                  ) : (
                    <Text style={styles.toDoText}>{toDos[key].text}</Text>
                  )}

                  <TouchableOpacity onPress={() => deleteToDo(key)}>
                    <AntDesign
                      name={icons["delete"]}
                      size={16}
                      color={theme.grey}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ) : null
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    flex: 1,
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
  },
  scrollContainer: { flex: 10 },
  btnText: { fontSize: 38, fontWeight: "600" },
  input: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  toDoText: {
    color: theme.grey,
    fontSize: 16,
    fontWeight: "500",
  },
  toDoTextInput: {
    color: "black",
    backgroundColor: "white",
    width: "90%",
  },
});
