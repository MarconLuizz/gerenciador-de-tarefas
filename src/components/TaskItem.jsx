import React, { useContext, useState, useEffect } from "react";
import { TaskContext } from "../contexts/TaskContext";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TaskItem({ task }) {
  const { dispatch } = useContext(TaskContext);
  const [openDesc, setOpenDesc] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(""); // Adicionando o estado tempoRestante

  const handleOpen = () => setOpenDesc(true);
  const handleClose = () => setOpenDesc(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const dataHoraStr = `${task.data}T${task.horario}`;
      const dataHora = new Date(dataHoraStr);
      const agora = new Date();
      const diff = dataHora - agora;

      if (diff <= 0) {
        setTempoRestante("Tarefa vencida");
        clearInterval(interval);
      } else {
        const horas = Math.floor(diff / (1000 * 60 * 60));
        const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diff % (1000 * 60)) / 1000);
        setTempoRestante(`${horas}h ${minutos}m ${segundos}s`);
      }
    }, 1000);

    return () => clearInterval(interval); // Limpando o intervalo ao desmontar
  }, [task.data, task.horario]);  // Dependência de data e horário

  return (
    <>
      <Card
        onClick={handleOpen}
        sx={{
          cursor: "pointer",
          opacity: task.concluida ? 0.6 : 1,
          textDecoration: task.concluida ? "line-through" : "none"
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Box>
            <Typography variant="h6">{task.nome}</Typography>
            <Typography>Venc.: {task.data} às {task.horario}</Typography>
            <Typography>Prioridade: {task.prioridade}</Typography>
            {/* Exibindo o tempo restante */}
            <Typography>Tempo restante: {tempoRestante}</Typography>
          </Box>
          <Box>
            {/* Ícone CONCLUIR muda de cor e não propaga o click para o Card */}
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: "CONCLUIR", payload: task.id });
              }}
            >
              <CheckCircleIcon
                color={task.concluida ? "success" : "action"}
                sx={{ fontSize: 28 }}
              />
            </IconButton>
            
            {/* Ícone REMOVER */}
            <IconButton
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: "REMOVER", payload: task.id });
              }}
            >
              <DeleteIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* Dialog para exibir a descrição da tarefa */}
      <Dialog open={openDesc} onClose={handleClose} fullWidth>
        <DialogTitle>Descrição da Tarefa</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            {task.descricao || "Nenhuma descrição informada."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
