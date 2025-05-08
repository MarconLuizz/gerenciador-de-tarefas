// src/components/TaskItem.jsx
import React, { useContext, useState, useEffect } from "react";
import { TaskContext } from "../contexts/TaskContext";
import { NotificationContext } from "../contexts/NotificationContext";
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
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function TaskItem({ task }) {
  const { dispatch } = useContext(TaskContext);
  const { notify } = useContext(NotificationContext);

  const [openDesc, setOpenDesc] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const [tempoRestante, setTempoRestante] = useState("");
  const [isUrgente, setIsUrgente] = useState(false);

  // Atualiza tempo restante a cada segundo
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
        setTempoRestante("Inválido");
        setIsUrgente(false);
        return;
      }
      const diff = dataHora - new Date();
      if (diff <= 0) {
        setTempoRestante("Expirado");
        setIsUrgente(false);
      } else {
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        const pad = (n) => String(n).padStart(2, "0");
        setTempoRestante(`${pad(h)}h ${pad(m)}m ${pad(s)}s`);
        setIsUrgente(diff <= 30 * 60000);
      }
    }

    updateTempo();
    const t = setInterval(updateTempo, 1000);
    return () => clearInterval(t);
  }, [task.data, task.horario]);

  // Handlers de diálogo
  const handleOpenDesc = () => setOpenDesc(true);
  const handleCloseDesc = () => setOpenDesc(false);

  const handleOpenEdit = (e) => {
    e.stopPropagation();
    setEditedTask({ ...task });
    setOpenEdit(true);
  };
  const handleCloseEdit = () => setOpenEdit(false);

  // Ações com notificação
  const handleConclude = (e) => {
    e.stopPropagation();
    dispatch({ type: "CONCLUIR", payload: task.id });
    notify(
      !task.concluida
        ? "Tarefa marcada como concluída!"
        : "Tarefa reaberta com sucesso!",
      "success"
    );
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    dispatch({ type: "REMOVER", payload: task.id });
    notify("Tarefa removida com sucesso!", "info");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((t) => ({ ...t, [name]: value }));
  };

  const salvarEdicao = () => {
    dispatch({ type: "EDITAR", payload: { id: task.id, dados: editedTask } });
    setOpenEdit(false);
    notify("Tarefa editada com sucesso!", "success");
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
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6">{task.nome}</Typography>
            <Typography variant="body2">
              Venc.: {task.data} às {task.horario}
            </Typography>
            <Typography variant="body2">
              Prioridade: {task.prioridade}
            </Typography>
            {tempoRestante && (
              <Typography
                variant="caption"
                sx={{ color: isUrgente ? "error.main" : "text.secondary" }}
              >
                Tempo restante: {tempoRestante}
              </Typography>
            )}
          </Box>

          <Box onClick={(e) => e.stopPropagation()}>
            <IconButton onClick={handleConclude}>
              <CheckCircleIcon color={task.concluida ? "success" : "action"} />
            </IconButton>

            <IconButton color="primary" onClick={handleOpenEdit}>
              <EditIcon />
            </IconButton>

            <IconButton color="error" onClick={handleRemove}>
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
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
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
          <Button variant="contained" onClick={salvarEdicao}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
