package com.anagha.staffclientservice.client;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.anagha.staffclientservice.admin.PlayerService;
import com.anagha.staffclientservice.staff.Staff;

@Service
public class ClientService {
	
	@Autowired
	private ClientRepository clientRepository;
	
	@Autowired
    private PlayerService playerService;
	
	@Autowired
    private PasswordEncoder passwordEncoder;
	 
	public List<Client> getAllClients(){
		List<Client> client=new ArrayList<>();
		clientRepository.findAll().forEach(client::add);
		return client;
	}
	
	
	public Client getClient(Long id){
		return clientRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("client not found with ID: " + id));
		
	}
	
	
	public void addClient(Client client) {
		String encodedPassword = passwordEncoder.encode(client.getPassword());
		client.setPassword(encodedPassword);
		//clientRepository.save(client);
		playerService.createOrUpdatePlayer(
				client.getUsername(),
				client.getPassword(),
				client.getRole()
	        );
		
	}

	public void updateClient(Long id, Client client) {
		Client existingClient = clientRepository.findById(id)
		        .orElseThrow(() -> new RuntimeException("Staff not found with ID: " + id));
		client.setId(id); 
	    if (client.getPassword() != null && !client.getPassword().isEmpty()) {
	    	client.setPassword(passwordEncoder.encode(client.getPassword()));
	    } else {
	    	client.setPassword(existingClient.getPassword()); 
	    }
	    
		clientRepository.save(client);
//		String encodedPassword = passwordEncoder.encode(client.getPassword());
//		client.setPassword(encodedPassword);
//		playerService.createOrUpdatePlayer(
//				client.getUsername(),
//				client.getPassword(),
//				client.getRole()
//	        );
	}
	

	
	public void deleteClient(Long id) {
		Client clientToDelete = clientRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Staff not found with ID: " + id));
		playerService.deletePlayerByUsername(clientToDelete.getUsername());
		clientRepository.deleteById(id);;
	}
	
	public boolean updateClientCredentials(Long id, String newUsername, String newPassword) {
        Optional<Client> clientOptional = clientRepository.findById(id);
        if (clientOptional.isPresent()) {
            Client client = clientOptional.get();
            String oldUsername = client.getUsername();
            client.setUsername(newUsername);
            
            String encodedPassword = passwordEncoder.encode(newPassword);
    		client.setPassword(encodedPassword);
    		
    		playerService.updatePlayerByOldUsername(
    				oldUsername,
    	            newUsername,
    	            encodedPassword,
    	            client.getRole()
    	        );
            clientRepository.save(client);
            return true;
        } else {
            return false;
        }
    }
}
