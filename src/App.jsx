import React from "react";
import { TaskProvider } from "./contexts/TaskContext";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function App() {
  return (
    <TaskProvider>
      <Header />
      <TaskForm />
      <TaskList />
    </TaskProvider>
  );
}

export default App;
