import { Toaster } from "react-hot-toast";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import ScrollToTop from "@/elements/ScrollToTop";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import "@/styles/global.scss";
import HomeTemplate from "@/templates/HomeTemplate";
import { ROUTES } from "@/utils/routes";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop /> {/* Scroll to top when navigate */}
      <Routes>
        <Route
          element={
            <HomeTemplate>
              <Outlet />
            </HomeTemplate>
          }
        >
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} />
        </Route>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="*"
          element={
            <HomeTemplate>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              >
                No Data
              </div>
            </HomeTemplate>
          }
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
