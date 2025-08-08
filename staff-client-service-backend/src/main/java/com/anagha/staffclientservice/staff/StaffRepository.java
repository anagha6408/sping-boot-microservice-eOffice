package com.anagha.staffclientservice.staff;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

public interface StaffRepository extends CrudRepository<Staff, Long> {

	Optional<Staff> findByUsername(String username);
}
