package com.example.battlestats.controller;

import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.battlestats.exceptions.ProfileException;
import com.example.battlestats.models.User;
import com.example.battlestats.repositories.UserRepo;

@RestController
public class UserController {

  @Autowired
  UserRepo userRepo;

  @Autowired UserRepo usrRepo;
  @PostMapping(path="/user/add")
  public String add(
    @RequestParam String usr,
    @RequestParam String email,
    @RequestParam String pwd,
    @RequestParam String pwd_confirm
  ) {
    try {
      User user_create=new User(usr);

      if(usrRepo.findByUsername(usr).size() > 0 && usrRepo.findByEmail(email).size() > 0) {
        throw new ProfileException("Email is already in use. Please enter another email.");
      } else {
        user_create.setUsername(usr);
        user_create.setEmail(email);
        user_create.setCreated_at(new Date());
        user_create.setRegistered_at(new Date());

        byte[] salt = user_create.getSalt();
        String hashPwd = user_create.hashPassword(pwd_confirm, salt);

        user_create.setPassword(hashPwd);

        userRepo.save(user_create);
      }

      return "Account created.";
    }
    catch (ProfileException e) {
      return e.toString();
    }
    catch(Exception e) {
      return "Unknown exception: Couldn't create account. Please try agin later.";
    }
  }
}
