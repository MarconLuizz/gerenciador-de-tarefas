import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Cria o root React dentro da div#root do index.html
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
