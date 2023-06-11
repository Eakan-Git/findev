import { Toaster } from "react-hot-toast";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import ScrollToTop from "@/elements/ScrollToTop";
import Auth from "@/pages/Auth";
import CvManager from "@/pages/CvManager";
import "@/styles/global.scss";
import TimeTable from "@/pages/TimeTable";
import HomeTemplate from "@/templates/HomeTemplate";
import { ROUTES } from "@/utils/routes";
import Profile from "@/pages/Profile";
import CreateCv from "@/pages/CreateCv";

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
          <Route path={ROUTES.CV_MANAGER} element={<CvManager />} />
          <Route path={ROUTES.TIME_TABLE} element={<TimeTable />} />
          <Route path={ROUTES.PROFILE} element={<Profile />} />
          <Route path={ROUTES.CREATE_CV} element={<CreateCv />} />
          <Route path="/" element={<CvManager />} />
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
                Không có dữ liệu
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
