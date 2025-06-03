// src/routes/AppRoutes.tsx

import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import CoopLivePage from "../pages/CoopLivePage";
import ControlSetupPage from "../pages/ControlSetupPage";
import InventorySalesPage from "../pages/InventorySalesPage";
import Navbar from "../components/Navbar";

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/cooplive" element={<CoopLivePage />} />
        <Route path="/controlsetup" element={<ControlSetupPage />} />
        <Route path="/inventorysales" element={<InventorySalesPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;