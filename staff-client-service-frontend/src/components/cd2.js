import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ClientDashboard() {
  const [clientList, setClientList] = useState([]);
  const [expandedClientId, setExpandedClientId] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
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
    navigate('/admin-dashboard'); 
  };
  localStorage.setItem("username", username);
  localStorage.setItem("password", password);


  useEffect(() => {
    const basicAuth = btoa(`${username}:${password}`);
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Basic ${basicAuth}`,
    };
    axios.get('http://localhost:9090/clients',{ headers })
      .then(response => {
        setClientList(response.data);
        setValidationErrors({});
      })
      .catch(error => {
        console.error("Error fetching client data:", error);
      });
  }, []);

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
    axios.put(`http://localhost:9090/clients/${editingClient.id}`, editingClient, { headers })
      .then(() => {
          return axios.get('http://localhost:9090/clients', { headers });
        })
        .then(response => {
          setClientList(response.data); 
          setShowModal(false);
          setEditingClient(null);
        })
        .catch(error => {
          console.error("Error updating client:", error);
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
        <h1 style={{ color: '#1e293b' }}><strong><u>Client Dashboard</u></strong></h1>
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
          <table>
            <tbody>
              <tr>
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
              </tr>
            </tbody>
          </table>
        </div>

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
              const errors = {};
              // Basic frontend validations
              if (!newClient.name) errors.name = "Name is required";
              if (!newClient.email || !/\S+@\S+\.\S+/.test(newClient.email)) errors.email = "Valid email is required";
              if (!newClient.organization) errors.organization = "Organization is required";
              if (!newClient.position) errors.position = "Position is required";
              if (!newClient.requestdate) errors.requestdate = "Request date is required";
              if (!newClient.address) errors.address = "Address is required";
              if (!newClient.phNo || !/^\d{10}$/.test(newClient.phNo)) errors.phNo = "Valid 10-digit phone number required";
              if (!newClient.place) errors.place = "Place is required";

              if (Object.keys(errors).length > 0) {
                setValidationErrors(errors);  // Display errors
                return;
              }

              // If validation passes, go to next step
              setValidationErrors({});
              setCurrentStep(2);
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
            const errors = {};
            if (!accountDetails.username) errors.username = "Username is required";
            if (!accountDetails.password) errors.password = "Password is required";

            if (Object.keys(errors).length > 0) {
              setValidationErrors(errors);  // Show errors
              return;
            }
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
              {validationErrors["username"] && <span style={{ color: 'red' }}>{validationErrors["username"]}</span>}
            </div>
            <div style={inputGroup}>
              <label>Password:</label>
              <input
                type="password"
                value={accountDetails.password}
                onChange={(e) => setAccountDetails({ ...accountDetails, password: e.target.value })}
              />
              {validationErrors["password"] && <span style={{ color: 'red' }}>{validationErrors["password"]}</span>}
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

export default ClientDashboard;
