// src/components/TaskForm.jsx
import React, { useState, useContext } from "react";
import { TaskContext } from "../contexts/TaskContext";
import { NotificationContext } from "../contexts/NotificationContext";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
} from "@mui/material";

export default function TaskForm() {
  const { dispatch } = useContext(TaskContext);
  const { notify } = useContext(NotificationContext);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    data: "",
    horario: "",
    prioridade: "",
    descricao: "",
  });
  const [errors, setErrors] = useState({});

  function validar() {
    const errs = {};
    if (!form.nome) errs.nome = "Obrigatório";
    if (!form.data) errs.data = "Obrigatório";
    if (!form.horario) errs.horario = "Obrigatório";
    if (!form.prioridade) errs.prioridade = "Obrigatório";
    return errs;
  }

  function handleAdd() {
    const errs = validar();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    dispatch({ type: "ADICIONAR", payload: form });
    notify("Tarefa adicionada com sucesso!", "success");

    // reset form
    setForm({
      nome: "",
      data: "",
      horario: "",
      prioridade: "",
      descricao: "",
    });
    setErrors({});
    setOpen(false);
  }

  return (
    <Box sx={{ textAlign: "center", my: 2 }}>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Adicionar Tarefa
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Nova Tarefa</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Nome da Tarefa"
            value={form.nome}
            onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
            error={!!errors.nome}
            helperText={errors.nome}
            fullWidth
          />

          <TextField
            label="Data de Vencimento"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.data}
            onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))}
            error={!!errors.data}
            helperText={errors.data}
            fullWidth
          />

          <TextField
            label="Horário"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={form.horario}
            onChange={(e) =>
              setForm((f) => ({ ...f, horario: e.target.value }))
            }
            error={!!errors.horario}
            helperText={errors.horario}
            fullWidth
          />

          <TextField
            select
            label="Prioridade"
            value={form.prioridade}
            onChange={(e) =>
              setForm((f) => ({ ...f, prioridade: e.target.value }))
            }
            error={!!errors.prioridade}
            helperText={errors.prioridade || "Selecione a prioridade"}
            fullWidth
          >
            {["Alta", "Média", "Baixa"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Descrição"
            multiline
            rows={3}
            value={form.descricao}
            onChange={(e) =>
              setForm((f) => ({ ...f, descricao: e.target.value }))
            }
            fullWidth
          />

          <Button variant="contained" onClick={handleAdd}>
            Adicionar Tarefa
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
