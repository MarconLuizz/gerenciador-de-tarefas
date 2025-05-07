import React, { useContext, useState } from "react";
import { TaskContext } from "../contexts/TaskContext";
import { Box, Typography, TextField } from "@mui/material";
import TaskItem from "./TaskItem";

export default function TaskList() {
  const { tasks } = useContext(TaskContext);
  const [busca, setBusca] = useState("");

  if (!tasks || tasks.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography>Nenhuma tarefa adicionada.</Typography>
      </Box>
    );
  }

  const prioridadePeso = { Alta: 3, Média: 2, Baixa: 1 };

  const tarefasOrdenadas = [...tasks].sort((a, b) => {
    if (a.concluida !== b.concluida) {
      return a.concluida ? 1 : -1;
    }
    return prioridadePeso[b.prioridade] - prioridadePeso[a.prioridade];
  });

  const tarefasFiltradas = tarefasOrdenadas.filter((task) =>
    task.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
      <TextField
        label="Buscar tarefa"
        variant="outlined"
        fullWidth
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        sx={{ mb: 2 }}
      />
      {tarefasFiltradas.length > 0 ? (
        tarefasFiltradas.map((task) => <TaskItem key={task.id} task={task} />)
      ) : (
        <Typography>Nenhuma tarefa encontrada.</Typography>
      )}
    </Box>
  );
}
