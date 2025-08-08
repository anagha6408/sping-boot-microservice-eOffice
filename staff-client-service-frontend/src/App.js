import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import Sd2 from "./components/sd2"; // staff dashboard
import Cd2 from "./components/cd2"; // client dashboard
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-staff-dashboard" element={<Sd2 />} />
        <Route path="/admin-client-dashboard" element={<Cd2 />} />
      </Routes>
    </Router>
  );
}

export default App;
