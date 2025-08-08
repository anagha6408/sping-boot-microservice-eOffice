import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ClientList from './ClientList'; 

function StaffDashboard() {
  
  const [staffList, setStaffList] = useState([]);
  const [expandedStaffId, setExpandedStaffId] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [updatedClientIds, setUpdatedClientIds] = useState([]);
  const [newStaff, setNewStaff] = useState({
    name: '',
    position: '',
    department: '',
    place: '',
    phNo: '',
    joinedDate: '',
    description: ''
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [accountDetails, setAccountDetails] = useState({
    username: '',
    password: '',
    role: 'STAFF'
  });
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/admin-dashboard'); 
  };

  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");

  useEffect(() => {
    const basicAuth = btoa(`${username}:${password}`);
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Basic ${basicAuth}`,
    };

    axios.get('http://localhost:9090/staffs', { headers })
      .then(response => {
        setStaffList(response.data);
      })
      .catch(error => {
        console.error("Error fetching staff data:", error);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      });
  }, [navigate, password, username]);

  const handleDelete = (id) => {
    const basicAuth = btoa(`${username}:${password}`);
    const headers = {
      "Authorization": `Basic ${basicAuth}`,
    };
    axios.delete(`http://localhost:9090/staffs/${id}`, { headers })
      .then(() => {
        setStaffList(prevList => prevList.filter(staff => staff.id !== id));
      })
      .catch(error => {
        console.error("Error deleting staff:", error);
      });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    const errors = {};
    
    if (!newStaff.name.trim()) errors.name = "Name is required";
    if (!newStaff.position.trim()) errors.position = "Position is required";
    if (!newStaff.department.trim()) errors.department = "Department is required";
    if (!newStaff.place.trim()) errors.place = "Location is required";
    if (!newStaff.phNo.trim()) errors.phNo = "Phone number is required";
    if (!/^\d{10}$/.test(newStaff.phNo)) errors.phNo = "Phone number must be 10 digits";
    if (!newStaff.joinedDate) errors.joinedDate = "Joined date is required";
    if (!newStaff.description.trim()) errors.description = "Description is required";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
    } else {
      setValidationErrors({});
      setCurrentStep(2);
    }
  };

  const handleAddStaffAndAccount = (e) => {
    e.preventDefault();
    const basicAuth = btoa(`${username}:${password}`);
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Basic ${basicAuth}`,
    };

    const staffDataWithAccount = {
      ...newStaff,
      username: accountDetails.username,
      password: accountDetails.password,
      role: 'STAFF'
    };

    axios.post('http://localhost:9090/staffs', staffDataWithAccount, { headers })
      .then(response => {
        setStaffList(prevList => [...prevList, response.data]);
        setShowAddModal(false);
        setNewStaff({
          name: '', position: '', department: '', place: '',
          phNo: '', joinedDate: '', description: ''
        });
        setAccountDetails({
          username: '', password: '', role: 'STAFF'
        });
        setCurrentStep(1); 
        setValidationErrors({});
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          setValidationErrors(error.response.data);
        } else {
          console.error("Unexpected error:", error);
        }
      });
  };

  const handleClientsChange = (newClientIds) => {
    // Update the state with new client IDs
    setUpdatedClientIds(newClientIds);
  };

  const handleEditStaff = (e) => {
    e.preventDefault();
    const basicAuth = btoa(`${username}:${password}`);
    console.log("username:", username);
    console.log("password:", password);
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Basic ${basicAuth}`,
    };

    const staffDataToUpdate = {
      ...editingStaff,
      clients: updatedClientIds.map(id => ({ id })) 
    };

    axios.put(`http://localhost:9090/staffs/${editingStaff.id}`, staffDataToUpdate, { headers })
      .then(response => {
        const updatedStaffFromServer = response.data;

        setStaffList(prevList => prevList.map(staff =>
          staff.id === updatedStaffFromServer.id ? updatedStaffFromServer : staff
        ));

        setShowModal(false);
        setEditingStaff(null);
        setValidationErrors({});
        setUpdatedClientIds([]); // Clear the updated client IDs state

        // Re-fetch staff data to ensure the latest information is displayed
        return axios.get('http://localhost:9090/staffs', { headers });
      })
      .then(response => {
        setStaffList(response.data); // Update the staff list with the latest data
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          setValidationErrors(error.response.data);
        } else {
          console.error("Unexpected error:", error);
        }
      });
  };

  const toggleExpand = (id) => {
    setExpandedStaffId(expandedStaffId === id ? null : id);
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
        <h1 style={{ color: '#1e293b' }}><strong><u>Staff Dashboard</u></strong></h1>
        <p>Manage your team efficiently</p>
        <div className="flex justify-between items-center mb-6">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px',
              width: '100%',
              maxWidth: '900px',
              margin: '0 auto'
            }}>
              {/* Back button */}
              <button
                onClick={handleBack}
                style={{ ...buttonStyle, backgroundColor: '#3b82f6',padding: '10px 20px',marginRight: '20px',marginLeft: '0px' }}
              >
                Back
              </button>

              {/* Total Staff */}
              <div style={{ fontSize: '18px', color: '#475569' ,padding: '10px 20px',marginRight: '40px',marginLeft:'30px'}}>
                Total Staff: <span style={{ fontWeight: 600, color: '#1e293b' }}>{staffList.length}</span>
              </div>

              {/* Add New Staff button */}
              <button
                onClick={() => setShowAddModal(true)}
                style={{ ...buttonStyle, backgroundColor: '#10b981' ,padding: '10px 20px',marginRight: '15px'}}
              >
                + New Staff
              </button>
            </div>
        </div>
        
        {showAddModal && (
          <div style={modalOverlay}>
            <div style={modalContent}>
              {currentStep === 1 && (
                <>
                  <h2>Add New Staff</h2>
                  <form onSubmit={handleNextStep}>
                    <div style={inputGroup}>
                      <label>Name:</label>
                      <input type="text" value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} />
                      {validationErrors.name && <span style={{ color: 'red' }}>{validationErrors.name}</span>}
                    </div>
                    <div style={inputGroup}>
                      <label>Position:</label>
                      <input type="text" value={newStaff.position} onChange={(e) => setNewStaff({ ...newStaff, position: e.target.value })} />
                      {validationErrors.position && <span style={{ color: 'red' }}>{validationErrors.position}</span>}
                    </div>
                    <div style={inputGroup}>
                      <label>Department:</label>
                      <input type="text" value={newStaff.department} onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })} />
                      {validationErrors.department && <span style={{ color: 'red' }}>{validationErrors.department}</span>}
                    </div>
                    <div style={inputGroup}>
                      <label>Location:</label>
                      <input type="text" value={newStaff.place} onChange={(e) => setNewStaff({ ...newStaff, place: e.target.value })} />
                      {validationErrors.place && <span style={{ color: 'red' }}>{validationErrors.place}</span>}
                    </div>
                    <div style={inputGroup}>
                      <label>Phone:</label>
                      <input type="text" value={newStaff.phNo} onChange={(e) => setNewStaff({ ...newStaff, phNo: e.target.value })} />
                      {validationErrors.phNo && <span style={{ color: 'red' }}>{validationErrors.phNo}</span>}
                    </div>
                    <div style={inputGroup}>
                      <label>Joined Date:</label>
                      <input type="date" value={newStaff.joinedDate} onChange={(e) => setNewStaff({ ...newStaff, joinedDate: e.target.value })} />
                      {validationErrors.joinedDate && <span style={{ color: 'red' }}>{validationErrors.joinedDate}</span>}
                    </div>
                    <div style={inputGroup}>
                      <label>Description:</label>
                      <textarea value={newStaff.description} onChange={(e) => setNewStaff({ ...newStaff, description: e.target.value })} />
                      {validationErrors.description && <span style={{ color: 'red' }}>{validationErrors.description}</span>}
                    </div>
                    <br />
                    <button type="submit" style={{ ...buttonStyle, backgroundColor: '#22c55e' }}>Next</button>
                    <button type="button" onClick={() => setShowAddModal(false)} style={{ ...buttonStyle, backgroundColor: '#e2e8f0', color: '#000' }}>Cancel</button>
                  </form>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <h2>Create Staff Account</h2>
                  <form onSubmit={handleAddStaffAndAccount}>
                    <div style={inputGroup}>
                      <label>Username:</label>
                      <input
                        type="text"
                        value={accountDetails.username}
                        onChange={(e) => setAccountDetails({ ...accountDetails, username: e.target.value })}
                      />
                      {validationErrors.username && <span style={{ color: 'red' }}>{validationErrors.username}</span>}
                    </div>
                    <div style={inputGroup}>
                      <label>Password:</label>
                      <input
                        type="password"
                        value={accountDetails.password}
                        onChange={(e) => setAccountDetails({ ...accountDetails, password: e.target.value })}
                      />
                      {validationErrors.password && <span style={{ color: 'red' }}>{validationErrors.password}</span>}
                    </div>
                    <div style={inputGroup}>
                      <label>Role:</label>
                      <input type="text" value="STAFF" readOnly />
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
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={thStyle}>Id</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Position</th>
              <th style={thStyle}>Department</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <React.Fragment key={staff.id}>
                <tr onClick={() => toggleExpand(staff.id)} style={{ cursor: 'pointer', backgroundColor: expandedStaffId === staff.id ? '#f9fafb' : 'white' }}>
                  <td style={tdStyle}>{staff.id}</td>
                  <td style={tdStyle}>{staff.name}</td>
                  <td style={tdStyle}>{staff.position}</td>
                  <td style={tdStyle}>{staff.department}</td>
                </tr>
                {expandedStaffId === staff.id && (
                  <tr>
                    <td colSpan="4" style={{ padding: '12px', border: '1px solid #ddd', backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                      <p><strong>Location:</strong> {staff.place}</p>
                      <p><strong>Joined Date:</strong> {staff.joinedDate}</p>
                      <p><strong>Phone Number:</strong> {staff.phNo}</p>
                      <p style={pStyle}><strong>Description:</strong> {staff.description}</p>
                      {staff.clients && staff.clients.length > 0 ? (
                        <>
                          <p><strong><u>Clients</u></strong></p>
                          {staff.clients.map((client, index) => (
                            <div key={index} style={{ marginLeft: '20px' }}>
                              <p><strong>ID:</strong> {client.id}</p>
                              <p><strong>Name:</strong> {client.name}</p>
                              <p><strong>Email:</strong> {client.email}</p>
                              <p><strong>Organization:</strong> {client.organization}</p>
                              <p><strong>Phone:</strong> {client.phNo}</p>
                              <hr />
                            </div>
                          ))}
                        </>
                      ) : (
                        <p>No clients assigned.</p>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingStaff(staff); setShowModal(true); }}
                        style={{ ...buttonStyle, backgroundColor: '#facc15', color: '#000' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(staff.id); }}
                        style={{ ...buttonStyle, backgroundColor: '#c32828ff' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )}
                {showModal && editingStaff && (
                  <div style={modalOverlay}>
                    <div style={modalContent}>
                      <h2>Edit Staff</h2>
                      <form onSubmit={handleEditStaff}>
                        <div style={inputGroup}>
                          <label>Name:</label>
                          <input type="text" value={editingStaff.name} onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })} />
                          {validationErrors.name && <span style={{ color: 'red' }}>{validationErrors.name}</span>}
                        </div>
                        <div style={inputGroup}>
                          <label>Position:</label>
                          <input type="text" value={editingStaff.position} onChange={(e) => setEditingStaff({ ...editingStaff, position: e.target.value })} />
                          {validationErrors.position && <span style={{ color: 'red' }}>{validationErrors.position}</span>}
                        </div>
                        <div style={inputGroup}>
                          <label>Department:</label>
                          <input type="text" value={editingStaff.department} onChange={(e) => setEditingStaff({ ...editingStaff, department: e.target.value })} />
                          {validationErrors.department && <span style={{ color: 'red' }}>{validationErrors.department}</span>}
                        </div>
                        <div style={inputGroup}>
                          <label>Location:</label>
                          <input type="text" value={editingStaff.place} onChange={(e) => setEditingStaff({ ...editingStaff, place: e.target.value })} />
                          {validationErrors.place && <span style={{ color: 'red' }}>{validationErrors.place}</span>}
                        </div>
                        <div style={inputGroup}>
                          <label>Joined Date:</label>
                          <input type="date" value={editingStaff.joinedDate} onChange={(e) => setEditingStaff({ ...editingStaff, joinedDate: e.target.value })} />
                          {validationErrors.joinedDate && <span style={{ color: 'red' }}>{validationErrors.joinedDate}</span>}
                        </div>
                        <div style={inputGroup}>
                          <label>Phone Number:</label>
                          <input type="text" value={editingStaff.phNo} onChange={(e) => setEditingStaff({ ...editingStaff, phNo: e.target.value })} />
                          {validationErrors.phNo && <span style={{ color: 'red' }}>{validationErrors.phNo}</span>}
                        </div>
                        <div style={inputGroup}>
                          <label>Description:</label>
                          <input type="text" value={editingStaff.description} onChange={(e) => setEditingStaff({ ...editingStaff, description: e.target.value })} />
                          {validationErrors.description && <span style={{ color: 'red' }}>{validationErrors.description}</span>}
                        </div>
                        <div className="modal">
                          <ClientList
                            staffId={editingStaff.id}
                            initialAssignedClients={editingStaff.clients || []}
                            onClientsChange={handleClientsChange} 
                          />
                        </div>
                <br />
                <button type="submit" style={{ ...buttonStyle, backgroundColor: '#22c55e' }}>Save</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ ...buttonStyle, backgroundColor: '#e2e8f0', color: '#000' }}>Cancel</button>
              </form>
            </div>
          </div>
        )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
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