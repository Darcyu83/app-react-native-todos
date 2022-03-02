export interface IGlobalState {
  isWorkShownLast: boolean | undefined;
  toDos: IToDos;
}

export interface IToDos {
  [key: string]: IToDo;
}

export interface IToDo {
  text: string;
  working: boolean;
  done: boolean;
}
