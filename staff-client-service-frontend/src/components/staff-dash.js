import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StaffDashboard() {
  const [staff, setStaff] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [expandedClientId, setExpandedClientId] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    organization: '',
    position: '',
    requestdate: '',
    address: '',
    phNo: '',
    place: '',
    description: ''
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [accountDetails, setAccountDetails] = useState({
    username: '',
    password: '',
    role: 'client'
  });
  const [validationErrors, setValidationErrors] = useState({});
  const username = localStorage.getItem("username"); 
  const role = localStorage.getItem("role"); 
  const password = localStorage.getItem("password"); 

  const navigate = useNavigate();
  const handleBack = () => {
   window.location.href = "/login";
  };
  localStorage.setItem("username", username);
  localStorage.setItem("password", password);


  useEffect(() => {
    const basicAuth = btoa(`${username}:${password}`);
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Basic ${basicAuth}`,
    };
    axios.get(`http://localhost:9090/staffs/username/${username}`, { headers })
      .then(response => {
        setStaff(response.data);
        setStaffList(response.data);
        setLoading(false);
        localStorage.setItem('staff', JSON.stringify(response.data));
        setNewUsername(response.data.username);
      })
      .catch(err => {
        console.error("Error fetching client data:", err);
        setError("Failed to fetch client data. Please check your credentials.");
        setLoading(false);
      });

       axios.get('http://localhost:9090/clients',{ headers })
      .then(response => {
        setClientList(response.data);
        setValidationErrors({});
      })
      .catch(error => {
        console.error("Error fetching client data:", error);
      });

      axios.get(`http://localhost:9090/staffs/${staff.id}`, { headers })
      .then(response => {
        setStaff(response.data);
      })
      .catch(error => {
        console.error("Error fetching staff data:", error);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      });
      const updatedData = {
      username: newUsername,
      password: newPassword,
    };
  }, [username, password]);



  const handleDelete = (id) => {
    const basicAuth = btoa(`${username}:${password}`);
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Basic ${basicAuth}`,
    };
    axios.delete(`http://localhost:9090/clients/${id}`, { headers })
      .then(() => {
        setClientList(prevList => prevList.filter(client => client.id !== id));
      })
      .catch(error => {
        console.error("Error deleting client:", error);
      });
  };

  const toggleExpand = (id) => {
    setExpandedClientId(expandedClientId === id ? null : id);
  };
  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowModal(true);
  };
  const handleUpdateClient = (e) => {
    e.preventDefault();
    const basicAuth = btoa(`${username}:${password}`);
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Basic ${basicAuth}`,
    };
  };

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

    
    axios.put(`http://localhost:9090/staffs/updateCredentials/${staff.id}`, updatedData, { headers })
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

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '50px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        {staffList.map((staff) => (
          <React.Fragment key={staff.id}>
            <h1>Welcome, Staff {staff.name}!</h1>
            <p>Your client details are listed below:</p>
              <p style={tdStyle}>{staff.id}</p>
              <p style={tdStyle}>{staff.name}</p>
              <p style={tdStyle}>{staff.position}</p>
              <p style={tdStyle}>{staff.department}</p>
              <p><strong>Location:</strong> {staff.place}</p>
              <p><strong>Joined Date:</strong> {staff.joinedDate}</p>
              <p><strong>Phone Number:</strong> {staff.phNo}</p>
              <p style={pStyle}><strong>Description:</strong> {staff.description}</p>
           </React.Fragment>
                      ))}
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
        <h1 style={{ color: '#1e293b' }}><strong><u>Staff Dashboard</u></strong></h1>
        <p>Manage your clients efficiently</p>
        <div className="flex justify-between items-center mb-6">
          {/* <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td>
                  <button onClick={handleBack} style={{ ...buttonStyle, backgroundColor: '#3b82f6' }}>Back</button>
                </td>
                <td style={{ textAlign: 'left' }}>
                  <div className="text-sm text-slate-600" >
                    Total Clients: <span className="font-semibold text-slate-800">{clientList.length}</span>
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => setShowAddModal(true)}
                    style={{ ...buttonStyle, backgroundColor: '#10b981' }}
                  >
                    + New Client
                  </button>
                </td>
              </tr>
            </tbody>
          </table> */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px',
              width: '100%',
              maxWidth: '900px',
              margin: '0 auto'
            }}>
              
              <button
                onClick={handleBack}
                style={{ ...buttonStyle, backgroundColor: '#3b82f6',padding: '10px 20px',marginRight: '20px',marginLeft: '0px' }}
              >
                Back
              </button>

              
              <div style={{ fontSize: '18px', color: '#475569' ,padding: '10px 20px',marginRight: '40px',marginLeft:'70px'}}>
                Total Clients: <span style={{ fontWeight: 600, color: '#1e293b' }}>{clientList.length}</span>
              </div>

             
              <button
                onClick={() => setShowAddModal(true)}
                style={{ ...buttonStyle, backgroundColor: '#10b981' ,padding: '10px 20px',marginRight: '30px'}}
              >
                + New Client
              </button>
            </div>
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
        {showAddModal && (
          <div style={modalOverlay}>
            <div style={modalContent}>
              <h2>Add New Client</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const basicAuth = btoa(`${username}:${password}`);
                const headers = {
                  "Content-Type": "application/json",
                  "Authorization": `Basic ${basicAuth}`,
                };
                axios.post('http://localhost:9090/clients',{headers}, newClient)
                  .then(() => axios.get('http://localhost:9090/clients'))
                  .then(response => {
                    setClientList(response.data);
                    setShowAddModal(false);
                    setNewClient({
                      name: '',
                      email: '',
                      organization: '',
                      position: '',
                      requestdate: '',
                      address: '',
                      phNo: '',
                      place: '',
                      description: ''
                    });
                    setValidationErrors({});
                  })
                  .catch(error => {
                    if (error.response && error.response.status === 400) {
                      setValidationErrors(error.response.data);
                    } else {
                      console.error("Unexpected error:", error);
                    }
                  });
              }}>
                {['name', 'email', 'organization', 'position', 'requestdate', 'address', 'phNo', 'place', 'description'].map(field => (
                  <div style={inputGroup} key={field}>
                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                    <input
                      type={field === 'requestdate' ? 'date' : 'text'}
                      value={newClient[field]}
                      onChange={(e) => setNewClient({ ...newClient, [field]: e.target.value })}
                    />
                    {validationErrors[field] && <span style={{ color: 'red' }}>{validationErrors[field]}</span>}
                  </div>
                ))}
                <br />
                <button type="submit" style={{ ...buttonStyle, backgroundColor: '#22c55e' }}>Add</button>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ ...buttonStyle, backgroundColor: '#e2e8f0', color: '#000' }}>Cancel</button>
              </form>
            </div>
          </div>
        )}

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Organization</th>
            </tr>
          </thead>
          <tbody>
            {clientList.map((client) => (
              <React.Fragment key={client.id}>
                <tr onClick={() => toggleExpand(client.id)} style={{ cursor: 'pointer', backgroundColor: expandedClientId === client.id ? '#f9fafb' : 'white' }}>
                  <td style={tdStyle}>{client.id}</td>
                  <td style={tdStyle}>{client.name}</td>
                  <td style={tdStyle}>{client.email}</td>
                  <td style={tdStyle}>{client.organization}</td>
                </tr>
                {expandedClientId === client.id && (
                  <tr>
                    <td colSpan="4" style={{ padding: '12px', border: '1px solid #ddd', backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                      <p><strong>Position:</strong> {client.position}</p>
                      <p><strong>Request Date:</strong> {client.requestdate}</p>
                      <p><strong>Address:</strong> {client.address}</p>
                      <p><strong>Phone Number:</strong> {client.phNo}</p>
                      <p><strong>Place:</strong> {client.place}</p>
                      <p style={pStyle}><strong>Description:</strong> {client.description}</p>
                      {client.staff ? (
                        <>
                          <p><strong><u>Staff details</u></strong></p>
                          <p><strong>Id:</strong> {client.staff.id}</p>
                          <p><strong>Name:</strong> {client.staff.name}</p>
                          <p><strong>Department:</strong> {client.staff.department}</p>
                          <p><strong>Phone Number:</strong> {client.staff.phNo}</p>
                        </>
                      ) : (
                        <p><strong><u>Staff details</u></strong><br />No staff member assigned.</p>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingClient(client); setShowModal(true); }}
                        style={{ ...buttonStyle, backgroundColor: '#facc15', color: '#000' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(client.id); }}
                        style={{ ...buttonStyle, backgroundColor: '#ef4444' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
  <div style={modalOverlay}>
    <div style={modalContent}>
      {currentStep === 1 ? (
        <>
          <h2>Add New Client</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            setCurrentStep(2); // Go to step 2 instead of saving directly
          }}>
            {['name', 'email', 'organization', 'position', 'requestdate', 'address', 'phNo', 'place', 'description'].map(field => (
              <div style={inputGroup} key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                <input
                  type={field === 'requestdate' ? 'date' : 'text'}
                  value={newClient[field]}
                  onChange={(e) => setNewClient({ ...newClient, [field]: e.target.value })}
                />
                {validationErrors[field] && <span style={{ color: 'red' }}>{validationErrors[field]}</span>}
              </div>
            ))}
            <br />
            <button type="submit" style={{ ...buttonStyle, backgroundColor: '#3b82f6' }}>Next</button>
            <button type="button" onClick={() => { setShowAddModal(false); setCurrentStep(1); }} style={{ ...buttonStyle, backgroundColor: '#e2e8f0', color: '#000' }}>Cancel</button>
          </form>
        </>
      ) : (
        <>
          <h2>Create Client Account</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const basicAuth = btoa(`${username}:${password}`);
            const headers = {
              "Content-Type": "application/json",
              "Authorization": `Basic ${basicAuth}`,
            };

            // First create the client
           axios.post('http://localhost:9090/clients', {
          ...newClient,
          username: accountDetails.username,
          password: accountDetails.password,
          role: 'CLIENT'
        }, { headers })
          .then(() => axios.get('http://localhost:9090/clients', { headers }))
          .then(response => {
            setClientList(response.data);
            setShowAddModal(false);
            setCurrentStep(1);
            setNewClient({
              name: '',
              email: '',
              organization: '',
              position: '',
              requestdate: '',
              address: '',
              phNo: '',
              place: '',
              description: ''
            });
            setAccountDetails({
              username: '',
              password: '',
              role: 'CLIENT'
            });
            setValidationErrors({});
          })
          .catch(error => {
            if (error.response && error.response.status === 400) {
              setValidationErrors(error.response.data);
            } else {
              console.error("Unexpected error:", error);
            }
          });

          }}>
            <div style={inputGroup}>
              <label>Username:</label>
              <input
                type="text"
                value={accountDetails.username}
                onChange={(e) => setAccountDetails({ ...accountDetails, username: e.target.value })}
              />
            </div>
            <div style={inputGroup}>
              <label>Password:</label>
              <input
                type="password"
                value={accountDetails.password}
                onChange={(e) => setAccountDetails({ ...accountDetails, password: e.target.value })}
              />
            </div>
            <div style={inputGroup}>
              <label>Role:</label>
              <input type="text" value="CLIENT" readOnly />
            </div>
            <br />
            <button type="submit" style={{ ...buttonStyle, backgroundColor: '#22c55e' }}>Save</button>
            <button type="button" onClick={() => setCurrentStep(1)} style={{ ...buttonStyle, backgroundColor: '#e2e8f0', color: '#000' }}>Back</button>
          </form>
        </>
      )}
    </div>
  </div>
)}
{showModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h2>Edit Client</h2>
            <form onSubmit={handleUpdateClient}>
              <div style={inputGroup}>
                <label>Name:</label>
                <input
                  type="text"
                  value={editingClient?.name || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                />
              </div>
              <div style={inputGroup}>
                <label>Email:</label>
                <input
                  type="email"
                  value={editingClient?.email || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                />
              </div>
              <div style={inputGroup}>
                <label>Organization:</label>
                <input
                  type="text"
                  value={editingClient?.organization || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, organization: e.target.value })}
                />
              </div>
              <div style={inputGroup}>
                <label>Position:</label>
                <input
                  type="text"
                  value={editingClient?.position || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, position: e.target.value })}
                />
              </div>
              <div style={inputGroup}>
                <label>Request Date:</label>
                <input
                  type="date"
                  value={editingClient?.requestdate || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, requestdate: e.target.value })}
                />
              </div>
              <div style={inputGroup}>
                <label>Address:</label>
                <input
                  type="text"
                  value={editingClient?.address || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, address: e.target.value })}
                />
              </div>
              <div style={inputGroup}>
                <label>Phone Number:</label>
                <input
                  type="text"
                  value={editingClient?.phNo || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, phNo: e.target.value })}
                />
              </div>
              <div style={inputGroup}>
                <label>Place:</label>
                <input
                  type="text"
                  value={editingClient?.place || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, place: e.target.value })}
                />
              </div>
              <div style={inputGroup}>
                <label>Description:</label>
                <textarea
                  value={editingClient?.description || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, description: e.target.value })}
                />
              </div>
              <br />
              <button type="submit" style={{ ...buttonStyle, backgroundColor: '#22c55e' }}>Save</button>
              <button type="button" onClick={() => { setShowModal(false); setEditingClient(null); }} style={{ ...buttonStyle, backgroundColor: '#e2e8f0', color: '#000' }}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
    
  );
}

const buttonStyle = {
  marginRight: '8px',
  padding: '6px 12px',
  backgroundColor: '#3b82f6',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const thStyle = {
  padding: '12px',
  borderBottom: '2px solid #ccc',
  backgroundColor: '#f1f5f9',
  fontWeight: 'bold',
  textAlign: 'left',
};

const tdStyle = {
  padding: '10px',
  borderBottom: '1px solid #ddd',
  textAlign: 'left',
};

const pStyle = {
  wordBreak: 'break-word',
  maxWidth: '550px',
};

const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContent = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  width: '400px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
};

const inputGroup = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '10px',
};

export default StaffDashboard;
