package com.anagha.staffclientservice.client;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anagha.staffclientservice.staff.StaffRepository;
import com.anagha.staffclientservice.staff.StaffService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/clients")
public class ClientController {

    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    private ClientService clientService;
    
    public ClientController(ClientRepository clientRepository, PasswordEncoder passwordEncoder) {
        this.clientRepository = clientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PostMapping
    public Client createClient(@Valid @RequestBody Client client) {
    	if (clientRepository.findByUsername(client.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists: " + client.getUsername());
        }
        //return clientRepository.save(client);
    	clientService.addClient(client);
    	return clientRepository.save(client);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @GetMapping
    public List<Client> getAllClients() {
        return clientService.getAllClients();
    }

    @GetMapping("/{id}")
    public Client getClient(@PathVariable Long id) {
        return clientService.getClient(id);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PutMapping("/{id}")
    public void updateClient(@Valid @RequestBody Client client, @PathVariable Long id) {
        client.setId(id); // assuming your Client class has setId()
        clientService.updateClient(id, client);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @DeleteMapping("/{id}")
    public void deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
    }
    
    @GetMapping("/username/{username}")
    public ResponseEntity<Client> getClientByUsername(@PathVariable String username) {
        Optional<Client> client = clientRepository.findByUsername(username);
        return client.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/updateCredentials/{id}")
    public ResponseEntity<?> updateCredentials(@PathVariable Long id, @RequestBody Map<String, String> credentials) {
        String newUsername = credentials.get("username");
        String newPassword = credentials.get("password");

        boolean updated = clientService.updateClientCredentials(id, newUsername, newPassword);
        if (updated) {
            return ResponseEntity.ok("Credentials updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Client not found or update failed");
        }
    }
}
