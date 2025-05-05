import React from "react";
import { Typography, Box } from "@mui/material";

export default function Header() {
  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h4">
        SEJA BEM-VINDO AO GERENCIADOR DE TAREFAS
      </Typography>
      <Typography variant="h4">Tarefas</Typography>
    </Box>
  );
}
