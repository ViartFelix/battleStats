package com.example.battlestats.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.example.battlestats.models.User;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {
	Optional<User> findByUsername(String username);
	//public User findByUsername(String name);
	//public User findByEmail(String email);
	Boolean existsByUsername(String username);
}
