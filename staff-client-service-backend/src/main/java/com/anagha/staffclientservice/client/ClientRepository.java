package com.anagha.staffclientservice.client;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

public interface ClientRepository extends CrudRepository <Client, Long> {
	Optional<Client> findByUsername(String username);

} 