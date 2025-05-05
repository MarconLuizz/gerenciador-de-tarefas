import React, { useContext } from "react";
import { TaskContext } from "../contexts/TaskContext";
import { Box, Typography } from "@mui/material";
import TaskItem from "./TaskItem";

export default function TaskList() {
  const { tasks } = useContext(TaskContext);

  if (!tasks || tasks.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography>Nenhuma tarefa adicionada.</Typography>
      </Box>
    );
  }

  // Peso para cada nível de prioridade
  const prioridadePeso = { Alta: 3, Média: 2, Baixa: 1 };

  // Ordena: não-concluídas primeiro, depois concluídas; e dentro de cada grupo, por prioridade
  const tarefasOrdenadas = [...tasks].sort((a, b) => {
    // 1) a.concluida === false deve vir antes de a.concluida === true
    if (a.concluida !== b.concluida) {
      return a.concluida ? 1 : -1;
    }
    // 2) mesma conclusão? ordenar por prioridade (peso maior primeiro)
    return prioridadePeso[b.prioridade] - prioridadePeso[a.prioridade];
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
      {tarefasOrdenadas.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </Box>
  );
}
