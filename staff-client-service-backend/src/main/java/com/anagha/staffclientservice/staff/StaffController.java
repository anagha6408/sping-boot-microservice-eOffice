package com.anagha.staffclientservice.staff;

import java.util.ArrayList;
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

import com.anagha.staffclientservice.client.Client;
import com.anagha.staffclientservice.client.ClientRepository;

import jakarta.validation.Valid;
 
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/staffs")
public class StaffController {

    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private StaffService staffService;
    
    @Autowired
    private ClientRepository clientRepository;

    public StaffController(StaffRepository staffRepository, PasswordEncoder passwordEncoder) {
        this.staffRepository = staffRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping 
    public Staff createStaff(@Valid @RequestBody Staff staff) {
    	if (staffRepository.findByUsername(staff.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists: " + staff.getUsername());
        }
    	List<Client> attachedClients = new ArrayList<>();

    	if (staff.getClients() != null) {
        for (Client c : staff.getClients()) {
            Client clientFromDb = clientRepository.findById(c.getId())
                                      .orElseThrow(() -> new RuntimeException("Client not found with id " + c.getId()));
            attachedClients.add(clientFromDb);
        }
    	}

        staff.setClients(attachedClients);
    	staffService.addStaff(staff);
        return staffRepository.save(staff);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @GetMapping
    public List<Staff> getAllStaffs() {
        return staffService.getAllStaffs();
    }


    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @GetMapping("/{id}") 
    public Staff getStaff(@PathVariable Long id) {
        return staffService.getStaff(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}") 
    public void updateStaff(@Valid @RequestBody Staff staff, @PathVariable Long id) {
        staff.setId(id);
        if (staff.getPassword() != null && !staff.getPassword().isEmpty()) {
            staff.setPassword(passwordEncoder.encode(staff.getPassword()));
        }
        staffService.updateStaff(id, staff);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}") 
    public void deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
    }
    
    @GetMapping("/username/{username}")
    public ResponseEntity<Staff> getClientByUsername(@PathVariable String username) {
        Optional<Staff> staff = staffRepository.findByUsername(username);
        return staff.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PutMapping("/updateCredentials/{id}")
    public ResponseEntity<?> updateCredentials(@PathVariable Long id, @RequestBody Map<String, String> credentials) {
        String newUsername = credentials.get("username");
        String newPassword = credentials.get("password");

        boolean updated = staffService.updateStaffCredentials(id, newUsername, newPassword);
        if (updated) {
            return ResponseEntity.ok("Credentials updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Staff not found or update failed");
        }
    }
}