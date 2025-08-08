import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ClientDashboard() {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    window.location.href = "/login";
  };

  useEffect(() => {
    if (!username || !password) {
      setError("Authentication credentials not found.");
      setLoading(false);
      return;
    }

    const basicAuth = btoa(`${username}:${password}`);
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Basic ${basicAuth}`,
    };

    axios.get(`http://localhost:9090/clients/username/${username}`, { headers })
      .then(response => {
        setClient(response.data);
        setLoading(false);
        setNewUsername(response.data.username); // pre-fill form
      })
      .catch(err => {
        console.error("Error fetching client data:", err);
        setError("Failed to fetch client data. Please check your credentials.");
        setLoading(false);
      });
  }, [username, password]);

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const basicAuth = btoa(`${username}:${password}`);
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Basic ${basicAuth}`,
    };

    const updatedData = {
      username: newUsername,
      password: newPassword,
    };

    axios.put(`http://localhost:9090/clients/updateCredentials/${client.id}`, updatedData, { headers })
      .then(res => {
        alert("Profile updated successfully!");
        localStorage.setItem("username", newUsername);
        localStorage.setItem("password", newPassword);
        setEditMode(false);
        window.location.reload(); // Optional: refresh to fetch new data
      })
      .catch(err => {
        console.error("Update failed:", err);
        alert("Failed to update profile.");
      });
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading client data...</div>;
  if (error) return <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>;
  if (!client) return <div style={{ padding: "20px" }}>No client data found.</div>;

  return (
    <div style={{ padding: "40px", fontFamily: 'Arial', backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '50px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <h1>Welcome, Client {client.name}!</h1>
        <p>Your client details are listed below:</p>
        <div style={{ textAlign: 'left', marginTop: '20px' }}>
          <p><strong>Username:</strong> {client.username}</p>
          <p><strong>Name:</strong> {client.name}</p>
          <p><strong>Email:</strong> {client.email}</p>
          <p><strong>Organization:</strong> {client.organization}</p>
          <p><strong>Position:</strong> {client.position}</p>
          <p><strong>Phone:</strong> {client.phNo}</p>
          <p><strong>Request Date:</strong> {client.requestdate}</p>
          <p><strong>Address:</strong> {client.address}</p>
          <p><strong>Place:</strong> {client.place}</p>
          <p><strong>Description:</strong> {client.description}</p>
          <p><strong><u>Staff details</u></strong></p>
          {client.staff ? (
            <>
              <p><strong>Name:</strong> {client.staff.name}</p>
              <p><strong>Phone Number:</strong> {client.staff.phNo}</p>
            </>
          ) : (
            <p>No staff assigned yet.</p>
          )}
        </div>

        {/* Edit Button */}
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2980b9",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "20px",
              marginRight: "10px"
            }}
          >
            Edit Profile
          </button>
        )}

        {/* Edit Form */}
        {editMode && (
          <form onSubmit={handleEditSubmit} style={{ marginTop: "20px", textAlign: "left" }}>
            <div style={{ marginBottom: "10px" }}>
              <label><strong>New Username:</strong></label><br />
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
                style={{ width: "100%", padding: "8px", borderRadius: "5px" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label><strong>New Password:</strong></label><br />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "8px", borderRadius: "5px" }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#27ae60",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "10px"
              }}
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#7f8c8d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          </form>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
