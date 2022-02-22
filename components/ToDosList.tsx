import React from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { IToDos } from "../type";

import { theme } from "../colors";
import ToDo from "./ToDo";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface IProps {
  isWorkShowedLast: boolean | undefined;
  toDos: IToDos;
  modifiedKey: string;
  textTypedToModi: string;
  isModalOpen: boolean;
  onChangeTextToModi: (text: string) => void;
  openModInput: (key: string, text: string) => void;
  updateToDo: (key: string) => void;
  deleteToDo: (key: string) => void;
  addToDoBack: (key: string) => void;
  completeToDo: (key: string) => void;
  closeModInput: () => void;
}

export default function ToDosList({
  isWorkShowedLast,
  toDos,
  modifiedKey,
  textTypedToModi,
  isModalOpen,
  closeModInput,
  onChangeTextToModi,
  openModInput,
  updateToDo,
  deleteToDo,
  addToDoBack,
  completeToDo,
}: IProps) {
  return (
    <View style={[styles.scrollContainer]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {toDos &&
          Object.keys(toDos).map((key, idx) =>
            isWorkShowedLast === toDos[key].working ? (
              <ToDo
                key={key}
                todoKey={key}
                toDos={toDos}
                idx={idx}
                modifiedKey={modifiedKey}
                textTypedToModi={textTypedToModi}
                openModInput={openModInput}
                updateToDo={updateToDo}
                onChangeTextToModi={onChangeTextToModi}
                deleteToDo={deleteToDo}
                addToDoBack={addToDoBack}
                completeToDo={completeToDo}
              />
            ) : null
          )}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={() => {
          // closeModInput();
        }}
      >
        <View style={styles.modalView}>
          <TextInput style={styles.modalTitle}>Modify</TextInput>
          <TextInput
            onSubmitEditing={() => {
              updateToDo(modifiedKey);
              closeModInput();
            }}
            style={styles.modalText}
            onChangeText={onChangeTextToModi}
            value={textTypedToModi}
          />
          <View style={styles.btns}>
            <Pressable onPress={closeModInput}>
              <Text style={styles.btn}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                updateToDo(modifiedKey);
                closeModInput();
              }}
            >
              <Text style={styles.btn}>Change</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  modalView: {
    height: 120,
    backgroundColor: "white",
    marginTop: SCREEN_HEIGHT * 0.35,
    marginHorizontal: 10,
    borderRadius: 20,
    padding: 20,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    borderColor: "black",
    borderWidth: 1,
  },
  modalText: {
    fontSize: 20,
    color: "black",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 5 },
  btns: { flex: 1, flexDirection: "row", justifyContent: "flex-end" },
  btn: { fontSize: 16, marginHorizontal: 5, marginVertical: 5, color: "black" },
});
