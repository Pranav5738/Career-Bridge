import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Register from "./pages/Register";
import RegisterStudent from "./pages/RegisterStudent";
import RegisterMentor from "./pages/RegisterMentor";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Forgot from "./pages/Forgot";
import ResetPassword from "./pages/ResetPassword";
import Marketplace from "./pages/Marketplace";
import Resume from "./pages/Resume";
import Skills from "./pages/Skills";
import Interview from "./pages/Interview";
import Webinars from "./pages/Webinars";
import CreateWebinar from "./pages/CreateWebinar";
import Forum from "./pages/Forum";
import StudentDashboard from "./pages/StudentDashboard";
import MentorDashboard from "./pages/MentorDashBoard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./devconnect/layout/AppLayout";

function App() {
  const { user } = useAuth();

  const appShell = (page) => (
    <ProtectedRoute>
      <AppLayout>{page}</AppLayout>
    </ProtectedRoute>
  );

  return (
    <BrowserRouter>
      <Routes>

        {/* Default Route */}
        <Route
          path="/"
          element={
            user ? (
              user.role === "mentor" ? (
                <Navigate to="/mentor-dashboard" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Landing />
            )
          }
        />

        {/* Public Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Registration */}
        <Route path="/register" element={<Register />} />
        <Route path="/register/student" element={<RegisterStudent />} />
        <Route path="/register/mentor" element={<RegisterMentor />} />

        {/* Student Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <AppLayout>
                <StudentDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Mentor Dashboard */}
        <Route
          path="/mentor-dashboard"
          element={
            <ProtectedRoute allowedRole="mentor">
              <AppLayout>
                <MentorDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* DevConnect Features */}
        <Route path="/marketplace" element={appShell(<Marketplace />)} />
        <Route path="/resume" element={appShell(<Resume />)} />
        <Route path="/skills" element={appShell(<Skills />)} />
        <Route path="/interview" element={appShell(<Interview />)} />
        <Route path="/webinars" element={appShell(<Webinars />)} />
        <Route
          path="/webinars/create"
          element={
            <ProtectedRoute allowedRole="mentor">
              <AppLayout>
                <CreateWebinar />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/forum" element={appShell(<Forum />)} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;