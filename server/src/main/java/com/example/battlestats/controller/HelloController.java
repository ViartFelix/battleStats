package com.example.battlestats.controller;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.battlestats.models.User;
import com.example.battlestats.repositories.UserRepo;

@RestController
public class HelloController {

  @Autowired
  UserRepo userRepo;
  
  @GetMapping("/")
  public String index() {
    System.out.println();

    String toReturn="""
        Bonjour de l'index !
        <form method="POST" action="/user/add">
          <input name="usr" label="usr"/>
          <input name="email" label="email"/>
          <input type="submit" value="submit"/>
        </form>
    """;

    return toReturn;
  }

  @Autowired UserRepo usrRepo;
  @PostMapping(path="/user/add")
  public String add(
    @RequestParam String usr,
    @RequestParam String email
  ) {
    try {
      User user=new User();
      user.setUsername(usr);
      user.setEmail(email);
      user.setRegistered_at(new Date());
      user.setPassword("1234");

      usrRepo.save(user);

      return "OK";
    } catch(Exception e) {
      return e.toString();
    }
  }

  @GetMapping("/user/all")
  public @ResponseBody Iterable<User> test() {
    return userRepo.findAll();
  }
}
