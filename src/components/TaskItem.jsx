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
  TextField,
  Button
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function TaskItem({ task }) {
  const { dispatch } = useContext(TaskContext);
  const [openDesc, setOpenDesc] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const [tempoRestante, setTempoRestante] = useState("");
  const [isUrgente, setIsUrgente] = useState(false);  // sinal de urgência
  
  // Atualiza tempo restante a cada segundo e sinaliza urgência (<30min)
  useEffect(() => {
    function updateTempo() {
      if (!task.data || !task.horario) {
        setTempoRestante("");
        setIsUrgente(false);
        return;
      }
      const dataHoraStr = `${task.data}T${task.horario}`;
      const dataHora = new Date(dataHoraStr);
      if (isNaN(dataHora.getTime())) {
        setTempoRestante("Invalid");
        setIsUrgente(false);
        return;
      }
      const agora = new Date();
      const diff = dataHora - agora;
      if (diff <= 0) {
        setTempoRestante("Expirado");
        setIsUrgente(false);
      } else {
        const horas = Math.floor(diff / (1000 * 60 * 60));
        const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diff % (1000 * 60)) / 1000);
        const pad = (n) => String(n).padStart(2, '0');
        setTempoRestante(`${pad(horas)}h ${pad(minutos)}m ${pad(segundos)}s`);
        setIsUrgente(diff <= 30 * 60 * 1000);
      }
    }
    updateTempo();
    const interval = setInterval(updateTempo, 1000);
    return () => clearInterval(interval);
  }, [task.data, task.horario]);

  const handleOpenDesc = () => setOpenDesc(true);
  const handleCloseDesc = () => setOpenDesc(false);
  const handleOpenEdit = (e) => {
    e.stopPropagation();
    setEditedTask({ ...task });
    setOpenEdit(true);
  };
  const handleCloseEdit = () => setOpenEdit(false);
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };
  const salvarEdicao = () => {
    dispatch({ type: "EDITAR", payload: { id: task.id, dados: editedTask } });
    setOpenEdit(false);
  };

  return (
    <>
      <Card
        onClick={handleOpenDesc}
        sx={{
          cursor: "pointer",
          opacity: task.concluida ? 0.6 : 1,
          textDecoration: task.concluida ? "line-through" : "none",
        }}
      >
        <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h6">{task.nome}</Typography>
            <Typography variant="body2">Venc.: {task.data} às {task.horario}</Typography>
            <Typography variant="body2">Prioridade: {task.prioridade}</Typography>
            {tempoRestante && (
              <Typography
                variant="caption"
                sx={{ color: isUrgente ? 'error.main' : 'text.secondary' }}
              >
                Tempo restante: {tempoRestante}
              </Typography>
            )}
          </Box>
          <Box onClick={(e) => e.stopPropagation()}>
            <IconButton onClick={() => dispatch({ type: "CONCLUIR", payload: task.id })}>
              <CheckCircleIcon color={task.concluida ? "success" : "action"} />
            </IconButton>
            <IconButton color="primary" onClick={handleOpenEdit}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={() => dispatch({ type: "REMOVER", payload: task.id })}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* Diálogo de descrição */}
      <Dialog open={openDesc} onClose={handleCloseDesc} fullWidth>
        <DialogTitle>Descrição da Tarefa</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            {task.descricao || "Sem descrição informada."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDesc}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de edição */}
      <Dialog open={openEdit} onClose={handleCloseEdit} fullWidth>
        <DialogTitle>Editar Tarefa</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Nome"
            name="nome"
            value={editedTask.nome}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            label="Data"
            name="data"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={editedTask.data}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            label="Horário"
            name="horario"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={editedTask.horario}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            label="Prioridade"
            name="prioridade"
            value={editedTask.prioridade}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            label="Descrição"
            name="descricao"
            value={editedTask.descricao || ""}
            onChange={handleEditChange}
            fullWidth
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancelar</Button>
          <Button variant="contained" onClick={salvarEdicao}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}