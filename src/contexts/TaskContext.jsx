import React, { createContext, useReducer } from "react";

// Estado inicial: lista vazia
const initialState = [];

// Actions: ADICIONAR, REMOVER, CONCLUIR
function taskReducer(state, action) {
  switch (action.type) {
    case "ADICIONAR":
      return [
        ...state,
        { id: Date.now(), ...action.payload, concluida: false },
      ];
    case "REMOVER":
      return state.filter((task) => task.id !== action.payload);
    case "CONCLUIR":
      return state.map((task) =>
        task.id === action.payload
          ? { ...task, concluida: !task.concluida }
          : task
      );
    case "EDITAR":
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, ...action.payload.dados }
          : task
      );
    default:
      return state;
  }
}

export const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  return (
    <TaskContext.Provider value={{ tasks: state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}
