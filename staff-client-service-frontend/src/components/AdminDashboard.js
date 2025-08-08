import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function AdminDashboard({ username, password, role }) {
  const [staffCount, setStaffCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const navigate = useNavigate();
  username = localStorage.getItem("username");
  password = localStorage.getItem("password");

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    window.location.href = "/login";
  };

  useEffect(() => {

    if (!username || !password) {
      navigate("/login");
      return;
    }
    const basicAuth = btoa(`${username}:${password}`);

    const fetchStaffData = async () => {
      try {
        const response = await fetch("http://localhost:9090/staffs", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${basicAuth}`,
          },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setStaffCount(data.length);
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };

    const fetchClientData = async () => {
      try {
        const response = await fetch("http://localhost:9090/clients", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${basicAuth}`,
          },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setClientCount(data.length);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    fetchStaffData();
    fetchClientData();
  }, [username, password]);

  function DashboardCard({ label, count, linkText, linkTo }) {
    return (
      <div className="border-4 border-black flex justify-between items-center mb-8 px-8 py-6">
        <div className="text-xs font-semibold">{label}</div>
        <div className="border-2 border-black rounded-full w-10 h-10 flex justify-center items-center text-lg font-semibold">{count}</div>
        <div className="text-xs font-semibold">TOTAL NUMBER</div>
        <Link to={linkTo} className="text-xs font-semibold text-blue-600 bg-blue-300 px-2 py-1">
          {linkText}
        </Link>
      </div>
    );
  }

  return (
   <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "20px",
  }}
>
  <div
    style={{
      backgroundColor: "#ffffff",
      padding: "40px",
      borderRadius: "20px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      maxWidth: "600px",
      width: "100%",
      textAlign: "center",
      margin: "35px auto",
    }}
  >
    <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "10px" }}>
      Welcome to Admin Dashboard!
    </h1>
    <p style={{ fontSize: "16px", marginBottom: "20px", color: "#555" }}>
      You have full control over staff, clients, and system settings.
    </p>

    <button
      onClick={handleLogout}
      style={{
        marginBottom: "30px",
        backgroundColor: "#dc3545",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
      }}
    >
      Logout
    </button>

   <div
  style={{
    display: "flex",
    gap: "40px",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "30px",
    flexWrap: "wrap",
  }}
>
  <div
    style={cardStyle}
    onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
    onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
  >
    <h3>STAFF</h3>
    <p style={{ fontSize: "24px", fontWeight: "bold" }}>{staffCount}</p>
    <a href="/admin-staff-dashboard" style={{ color: "#007bff" }}>
      Go to Staff Dashboard
    </a>
  </div>

  <div
    style={cardStyle}
    onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
    onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
  >
    <h3>CLIENT</h3>
    <p style={{ fontSize: "24px", fontWeight: "bold" }}>{clientCount}</p>
    <a href="/admin-client-dashboard" style={{ color: "#007bff" }}>
      Go to Client Dashboard
    </a>
  </div>
</div>

  </div>
</div>

  );
  
}
const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
  width: "250px",
  textAlign: "center",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};

const hoverStyle = {
  transform: "scale(1.05)",
  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.15)",
};

export default AdminDashboard;
