import React, { useContext } from "react";
import { TaskContext } from "../contexts/TaskContext";
import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TaskItem({ task }) {
  const { dispatch } = useContext(TaskContext);

  return (
    <Card
      sx={{
        opacity: task.concluida ? 0.6 : 1,
        textDecoration: task.concluida ? "line-through" : "none",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h6">{task.nome}</Typography>
          <Typography>Venc.: {task.data}</Typography>
          <Typography>Prioridade: {task.prioridade}</Typography>
        </Box>
        <Box>
          <IconButton
            onClick={() => dispatch({ type: "CONCLUIR", payload: task.id })}
          >
            <CheckCircleIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => dispatch({ type: "REMOVER", payload: task.id })}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}
