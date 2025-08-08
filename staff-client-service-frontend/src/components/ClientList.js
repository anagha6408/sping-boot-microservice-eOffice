import React, { useEffect, useState } from 'react';
import axios from 'axios';

// The onClientsChange prop is a callback function from the parent
function ClientList({ staffId, initialAssignedClients = [], onClientsChange }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");
  
  // Initialize the state with the IDs from the parent component
  const [selectedClientIds, setSelectedClientIds] = useState(
    initialAssignedClients.map(client => client.id)
  );

  useEffect(() => {
    // This is just for fetching the full list of all available clients
    const basicAuth = btoa(`${username}:${password}`);
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Basic ${basicAuth}`,
    };
    
    axios.get('http://localhost:9090/clients', { headers })
      .then(response => {
        setClients(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching clients:", error);
        setError(error);
        setLoading(false);
      });
  }, [username, password]);

  const handleCheckboxChange = (clientId, isChecked) => {
    let newSelectedClientIds;
    if (isChecked) {
      newSelectedClientIds = [...selectedClientIds, clientId];
    } else {
      newSelectedClientIds = selectedClientIds.filter(id => id !== clientId);
    }
    
    setSelectedClientIds(newSelectedClientIds);
    
    // Pass the new list of IDs back to the parent component
    onClientsChange(newSelectedClientIds);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h3>Select Clients</h3>
      <div>
        {clients.map(client => (
          <label key={client.id} style={{ display: 'block', marginBottom: '8px' }}>
            <input
              type="checkbox"
              value={client.id}
              checked={selectedClientIds.includes(client.id)}
              onChange={(e) => handleCheckboxChange(client.id, e.target.checked)}
            />
            {client.name} (ID: {client.id})
          </label>
        ))}
      </div>
    </div>
  );
}

export default ClientList;