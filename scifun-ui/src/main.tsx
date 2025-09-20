import React from "react";
import ReactDOM from "react-dom/client";
import { AuthWrapper } from "./components/context/auth.context";
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthWrapper>
      <App />
    </AuthWrapper>
  </React.StrictMode>
);
