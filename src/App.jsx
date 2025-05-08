// src/App.jsx
import React from "react";
import { TaskProvider } from "./contexts/TaskContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function App() {
  return (
    <NotificationProvider>
      <TaskProvider>
        <Header />
        <TaskForm />
        <TaskList />
      </TaskProvider>
    </NotificationProvider>
  );
}

export default App;
