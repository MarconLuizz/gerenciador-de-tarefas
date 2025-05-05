import React, { useState, useContext } from "react";
import { TaskContext } from "../contexts/TaskContext";
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
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    data: "",
    prioridade: "",
    descricao: "",
  });
  const [errors, setErrors] = useState({});

  function validar() {
    const errs = {};
    if (!form.nome) errs.nome = "Obrigatório";
    if (!form.data) errs.data = "Obrigatório";
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
    setForm({ nome: "", data: "", prioridade: "", descricao: "" });
    setErrors({});
    setOpen(false);
  }

  return (
    <Box sx={{ textAlign: "center", my: 2 }}>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Adicionar Tarefa
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Nova Tarefa</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Nome da Tarefa"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            error={!!errors.nome}
            helperText={errors.nome}
          />
          <TextField
            label="Data de Vencimento"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
            error={!!errors.data}
            helperText={errors.data}
          />
          <TextField
            select
            label="Prioridade"
            value={form.prioridade}
            onChange={(e) => setForm({ ...form, prioridade: e.target.value })}
            error={!!errors.prioridade}
            helperText={errors.prioridade || "Selecione a prioridade"}
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
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />
          <Button variant="contained" onClick={handleAdd}>
            Adicionar Tarefa
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
