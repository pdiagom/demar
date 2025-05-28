// MaintenancePage.jsx
import React from "react";
import image from "../../../media/media/prohibido.png";
const MaintenancePage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <img src={image} alt="Prohibido" className="prohibido" />
      <h2>Página restringida</h2>
      <p>Lo sentimos, esta página está disponible solo para administradores.</p>
    </div>
  );
};

export default MaintenancePage;
