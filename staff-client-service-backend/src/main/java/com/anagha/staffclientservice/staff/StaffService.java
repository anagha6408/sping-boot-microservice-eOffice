package com.anagha.staffclientservice.staff;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.anagha.staffclientservice.admin.PlayerService;
import com.anagha.staffclientservice.client.Client;
import com.anagha.staffclientservice.client.ClientRepository;

@Service
public class StaffService {

	@Autowired
	private StaffRepository staffRepository;
	
	@Autowired
    private ClientRepository clientRepository;
	
	@Autowired
    private PlayerService playerService;
	
	@Autowired
    private PasswordEncoder passwordEncoder;
	
	
	public List<Staff> getAllStaffs(){
		List<Staff> staff=new ArrayList<>();
		staffRepository.findAll().forEach(staff::add);
		return staff;
	}
	
	public Staff getStaff(Long id){
		return staffRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Staff not found with ID: " + id));
		
	}
	
	
	public void addStaff(Staff staff) {
		staffRepository.save(staff);
		String encodedPassword = passwordEncoder.encode(staff.getPassword());
	    staff.setPassword(encodedPassword);
		playerService.createOrUpdatePlayer(
	            staff.getUsername(),
	            staff.getPassword(),
	            staff.getRole()
	        );
	}

	public void updateStaff(Long id, Staff staff) {
	    Staff existingStaff = staffRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Staff not found with ID: " + id));
	    if (staff.getName() != null && !staff.getName().isBlank()) {
	        existingStaff.setName(staff.getName());
	    }

	    if (staff.getDepartment() != null && !staff.getDepartment().isBlank()) {
	        existingStaff.setDepartment(staff.getDepartment());
	    }

	    if (staff.getPosition() != null && !staff.getPosition().isBlank()) {
	        existingStaff.setPosition(staff.getPosition());
	    }

	    if (staff.getJoinedDate() != null) {
	        existingStaff.setJoinedDate(staff.getJoinedDate());
	    }

	    if (staff.getPhNo() != null && !staff.getPhNo().isBlank()) {
	        existingStaff.setPhNo(staff.getPhNo());
	    }

	    if (staff.getPlace() != null && !staff.getPlace().isBlank()) {
	        existingStaff.setPlace(staff.getPlace());
	    }

	    if (staff.getDescription() != null) {
	        existingStaff.setDescription(staff.getDescription());
	    }

	    if (staff.getClients() != null) {
	        for (Client client : existingStaff.getClients()) {
	            client.setStaff(null);
	        }
	        existingStaff.getClients().clear();
	        for (Client clientFromRequest : staff.getClients()) {
	            Client clientFromDb = clientRepository.findById(clientFromRequest.getId())
	                    .orElseThrow(() -> new RuntimeException("Client not found with id " + clientFromRequest.getId()));
	            clientFromDb.setStaff(existingStaff);
	            existingStaff.getClients().add(clientFromDb);
	        }
	    }
	    staffRepository.save(existingStaff);
	}

//	public void updateStaff(Long id, Staff staff) {
//	    Staff existingStaff = staffRepository.findById(id)
//	            .orElseThrow(() -> new RuntimeException("Staff not found with ID: " + id));
//
//	    if (staff.getPassword() != null && !staff.getPassword().isEmpty()) {
//	        String encodedPassword = passwordEncoder.encode(staff.getPassword());
//	        existingStaff.setPassword(encodedPassword);
//	    }
//
//	    // Update staff details
//	    existingStaff.setName(staff.getName());
//	    existingStaff.setPosition(staff.getPosition());
//	    existingStaff.setDepartment(staff.getDepartment());
//	    existingStaff.setPosition(staff.getPosition());
//	    existingStaff.setJoinedDate(staff.getJoinedDate());
//	    existingStaff.setPhNo(staff.getPhNo());
//	    existingStaff.setPlace(staff.getPlace());
//	    existingStaff.setDescription(staff.getDescription());
//
//	    // 1. Remove old client associations
//	    if (staff.getClients() != null) {
//	        // Remove old clients' staff reference
//	        for (Client client : existingStaff.getClients()) {
//	            client.setStaff(null);
//	        }
//	        existingStaff.getClients().clear();
//
//	        // Add new clients with staff assignment
//	        for (Client clientFromRequest : staff.getClients()) {
//	            Client clientFromDb = clientRepository.findById(clientFromRequest.getId())
//	                    .orElseThrow(() -> new RuntimeException("Client not found with id " + clientFromRequest.getId()));
//	            clientFromDb.setStaff(existingStaff);
//	            existingStaff.getClients().add(clientFromDb);
//	        }
//	    }
//
//	    // 2. Add new client associations and save the clients
//	    if (staff.getClients() != null) {
//	        for (Client clientFromRequest : staff.getClients()) {
//	            Client clientFromDb = clientRepository.findById(clientFromRequest.getId())
//	                    .orElseThrow(() -> new RuntimeException("Client not found with id " + clientFromRequest.getId()));
//
//	            clientFromDb.setStaff(existingStaff); // Set the new staff member
//	            existingStaff.getClients().add(clientFromDb);
//	        }
//	    }
//
//	    // 3. Save the updated staff and all the attached clients
//	    staffRepository.save(existingStaff);
//	    
//	    // Call player service with correctly encoded password
//	    playerService.createOrUpdatePlayer(
//	        existingStaff.getUsername(),
//	        existingStaff.getPassword(),
//	        existingStaff.getRole()
//	    );
//	}

	public void deleteStaff(Long id) {
		Staff staffToDelete = staffRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Staff not found with ID: " + id));
		playerService.deletePlayerByUsername(staffToDelete.getUsername());
		staffRepository.deleteById(id);
	}

	public boolean updateStaffCredentials(Long id, String newUsername, String newPassword) {
	    Optional<Staff> staffOptional = staffRepository.findById(id);
	    if (staffOptional.isPresent()) {
	        Staff staff = staffOptional.get();

	        String oldUsername = staff.getUsername();  // Capture the old username

	        staff.setUsername(newUsername);
	        String encodedPassword = passwordEncoder.encode(newPassword);
	        staff.setPassword(encodedPassword);

	        // Use old username to find and update Player
	        playerService.updatePlayerByOldUsername(
	            oldUsername,
	            newUsername,
	            encodedPassword,
	            staff.getRole()
	        );

	        staffRepository.save(staff);
	        return true;
	    } else {
	        return false;
	    }
	}

}
