import { StatusBar } from "expo-status-bar";
import React, { ChangeEvent, useEffect, useState } from "react";
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

  return (
    <View style={[styles.container]}>
      <StatusBar style="auto" />
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
      <View>
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
              <View key={idx} style={styles.toDo}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <AntDesign
                    name={icons["delete"]}
                    size={16}
                    color={theme.grey}
                  />
                </TouchableOpacity>
              </View>
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
  },
  header: {
    flexDirection: "row",
    marginTop: 100,
    justifyContent: "space-between",
  },
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
  toDoText: { color: theme.grey, fontSize: 16, fontWeight: "500" },
});
