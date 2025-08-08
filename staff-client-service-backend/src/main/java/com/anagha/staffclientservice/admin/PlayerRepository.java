package com.anagha.staffclientservice.admin;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

public interface PlayerRepository extends CrudRepository<Player, Long> {
	Optional<Player> findByUsername(String username);
	void deleteByUsername(String username);
}
