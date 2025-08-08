package com.anagha.staffclientservice.admin;
import org.springframework.data.repository.CrudRepository;

public interface AdminRepository extends CrudRepository <Player, Long>{
	Player findByUsername(String username);
}

