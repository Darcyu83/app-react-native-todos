import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { theme } from "./colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ToDosList from "./components/ToDosList";
import { IGlobalState, IToDos } from "./type";
import Header from "./components/Header";
import ToDoInput from "./components/ToDoInput";

const STORAGE_KEY = "@toDos";
export default function App() {
  const [textTyped, setTextTyped] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalState, setGlobalState] = useState<IGlobalState>({
    isWorkShowedLast: undefined,
    toDos: {},
  });

  const { isWorkShowedLast, toDos } = globalState;

  const [modifiedKey, setModifiedKey] = useState("");
  const [textTypedToModi, setTextTypedToModi] = useState("");

  useEffect(() => {
    loadToDos();
  }, []);

  const travel = () => {
    setGlobalState({ ...globalState, isWorkShowedLast: false });
    saveStateToStorage({ ...globalState, isWorkShowedLast: false });
  };
  const work = () => {
    setGlobalState({ ...globalState, isWorkShowedLast: true });
    saveStateToStorage({ ...globalState, isWorkShowedLast: true });
  };

  const onChangeText = (text: string) => {
    setTextTyped(text);
  };
  const onChangeTextToModi = (text: string) => {
    setTextTypedToModi(text);
  };

  const saveStateToStorage = async (value: IGlobalState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      s && setGlobalState(JSON.parse(s));
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const openModInput = (key: string, text: string) => {
    setModifiedKey(key);
    setIsModalOpen(true);
    setTextTypedToModi(text);
  };

  const closeModInput = () => {
    setIsModalOpen(false);
    setModifiedKey("");
  };

  const addToDo = async () => {
    if (textTyped === "") {
      return;
    }
    const newToDos: IToDos = {
      ...toDos,
      [Date.now()]: { text: textTyped, working: isWorkShowedLast, done: false },
    };
    const state = { ...globalState, toDos: newToDos };

    setGlobalState((curr) => state);
    await saveStateToStorage(state);
    setTextTyped("");
  };

  const updateToDo = async (key: string) => {
    const newToDos = {
      ...toDos,
      [key]: { ...toDos[key], text: textTypedToModi },
    };
    const state = { ...globalState, toDos: newToDos };
    setGlobalState(state);
    await saveStateToStorage(state);
    setModifiedKey("");
  };

  const deleteToDo = async (key: string) => {
    Alert.alert("Delete", "Are you sure to delete of it?", [
      { text: "Cancel" },
      {
        text: "Remove",
        onPress: async () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          const state = { ...globalState, toDos: newToDos };
          setGlobalState(state);
          await saveStateToStorage(state);
        },
      },
    ]);
  };

  const addToDoBack = async (key: string) => {
    const newToDos = { ...toDos, [key]: { ...toDos[key], done: false } };
    const state = { ...globalState, toDos: newToDos };
    setGlobalState(state);
    await saveStateToStorage(state);
  };

  const completeToDo = async (key: string) => {
    const newToDos = { ...toDos, [key]: { ...toDos[key], done: true } };
    const state = { ...globalState, toDos: newToDos };
    setGlobalState(state);
    await saveStateToStorage(state);
  };
  return (
    <View style={[styles.container]}>
      <StatusBar style="light" />
      <Header isWorkShowedLast={isWorkShowedLast} work={work} travel={travel} />
      <ToDoInput
        isWorkShowedLast={isWorkShowedLast}
        textTyped={textTyped}
        onChangeText={onChangeText}
        addToDo={addToDo}
      />
      <ToDosList
        closeModInput={closeModInput}
        isWorkShowedLast={isWorkShowedLast}
        toDos={toDos}
        textTypedToModi={textTypedToModi}
        isModalOpen={isModalOpen}
        onChangeTextToModi={onChangeTextToModi}
        openModInput={openModInput}
        modifiedKey={modifiedKey}
        updateToDo={updateToDo}
        deleteToDo={deleteToDo}
        addToDoBack={addToDoBack}
        completeToDo={completeToDo}
      />
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
  btnText: { fontSize: 38, fontWeight: "600" },
});
