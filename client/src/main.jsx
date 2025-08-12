import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // 1. Importamos nuestro AuthProvider
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/*2. Envolvemos nuestra aplicación con BrowserRouter para manejar las rutas */}
    <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);