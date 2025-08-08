import React, { useState } from "react";
import axios from "axios";
import AdminDashboard from "./AdminDashboard";
import StaffDashboard from "./StaffDashboard";
import ClientDashboard from "./ClientDashboard";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loggedInRole, setLoggedInRole] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
        const response = await axios.post("http://localhost:9090/login", {
            username,
            password,
            role
        });

        localStorage.setItem("username", username);
        localStorage.setItem("role", role);
        localStorage.setItem("password", password);
        
        const data = response.data;
        console.log("Login response:", data);

        if (data && data.id && data.username) {
            localStorage.setItem("staff", JSON.stringify(data)); 
            setLoggedInRole(role);
        } 

        if (data.includes("Login successful")) {
            setLoggedInRole(role);
        } else {
            alert(data);
        }

    } catch (err) {
        console.error("Login failed:", err);
        if (err.response && err.response.data) {
            setError(err.response.data); // Set error message from server
        } else {
            setError("Invalid username, password, or role");
        }
    }
};

        if (loggedInRole === "ADMIN") {
            return <AdminDashboard 
            username={username} 
            password={password} 
            role={role}  />;
        }
        if (loggedInRole === "STAFF") {
            return <StaffDashboard 
            username={username} 
            password={password} 
            role={role}  />;
        }
        if (loggedInRole === "CLIENT") {
            return <ClientDashboard 
            username={username} 
            password={password} 
            role={role}  />;
        }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Username</label>
            <input
              type="text"
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username" // Add this line
            />

            <label style={styles.label}>Password</label>
            <input
              type="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password" // Add this line
            />

          <label style={styles.label}>Role</label>
          <select
            style={styles.input}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">-- Select Role --</option>
            <option value="ADMIN">Admin</option>
            <option value="STAFF">Staff</option>
            <option value="CLIENT">Client</option>
          </select>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    backgroundColor: "#f4f4f4",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "8px",
    width: "300px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333"
  },
  label: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "5px",
    display: "block"
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px"
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "15px",
    cursor: "pointer"
  },
  error: {
    color: "red",
    fontSize: "13px",
    marginBottom: "10px"
  }
};

export default Login;
