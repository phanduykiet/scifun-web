import React from "react";
import ReactDOM from "react-dom/client";
import { AuthWrapper } from "./components/context/auth.context";
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './index.css';
import App from './App';
import ScrollRestoration from "./components/common/ScrollRestoration";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthWrapper>
        <ScrollRestoration />
        <App />
      </AuthWrapper>
    </BrowserRouter>
  </React.StrictMode>
);
