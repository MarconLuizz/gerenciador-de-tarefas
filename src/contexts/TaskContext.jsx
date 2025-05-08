// src/contexts/TaskContext.jsx
import React, { createContext, useReducer, useEffect } from "react";

// Estado inicial: lista vazia
const initialState = [];

// Actions: SET_TAREFAS, ADICIONAR, REMOVER, CONCLUIR, EDITAR
function taskReducer(state, action) {
  switch (action.type) {
    case "SET_TAREFAS":
      return action.payload;

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
  const [tasks, dispatch] = useReducer(taskReducer, initialState);

  // Carrega tarefas iniciais da API JSON Placeholder
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
      .then((response) => response.json())
      .then((data) => {
        const tarefasIniciais = data.map((todo) => ({
          id: todo.id, //id da API
          nome: todo.title, // título da API
          data: "2025-05-09", // data fixa
          horario: "23:59", // horário fixo
          prioridade: "Média", // prioridade padrão
          descricao: "Projeto React.js Faculdade", // descrição padrão
          concluida: todo.completed, // estado concluído da API
        }));
        dispatch({ type: "SET_TAREFAS", payload: tarefasIniciais });
      })
      .catch((error) => console.error("Erro ao carregar tarefas:", error));
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}
