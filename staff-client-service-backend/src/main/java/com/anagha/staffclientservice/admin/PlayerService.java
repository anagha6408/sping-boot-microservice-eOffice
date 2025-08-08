package com.anagha.staffclientservice.admin;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class PlayerService {
 @Autowired
 private PlayerRepository playerRepository;

 public void createOrUpdatePlayer(String username, String password, String role) {
	 System.out.println("createOrUpdatePlayer is here...");
     Optional<Player> existingPlayerOpt = playerRepository.findByUsername(username);

     Player player;
     if (existingPlayerOpt.isPresent()) {
         player = existingPlayerOpt.get();
     } else {
         player = new Player();
         player.setUsername(username);
     }
     
     player.setPassword(password);
     player.setRole(role);
     
     playerRepository.save(player);
 }
 
 public void updatePlayerByOldUsername(String oldUsername, String newUsername, String password, String role) {
	    Optional<Player> existingPlayerOpt = playerRepository.findByUsername(oldUsername);

	    Player player;
	    if (existingPlayerOpt.isPresent()) {
	        player = existingPlayerOpt.get();
	    } else {
	        player = new Player(); // Create new if not found by old username
	    }

	    player.setUsername(newUsername);
	    player.setPassword(password);
	    player.setRole(role);

	    playerRepository.save(player);
	}

 
 @Transactional
 public void deletePlayerByUsername(String username) {
     Optional<Player> playerToDelete = playerRepository.findByUsername(username);
     playerToDelete.ifPresent(player -> playerRepository.delete(player));
 }
}