package com.example.battlestats.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.example.battlestats.models.User;

@Repository
public interface UserRepo extends CrudRepository<User, Integer> {
  
}
