package com.example.battlestats.controller;

import java.io.IOException;
import java.net.http.HttpResponse;
import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.battlestats.models.User;
import com.example.battlestats.repositories.UserRepo;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;


@RestController
@CrossOrigin
@RequestMapping("/user")
public class UserController {

	@Autowired
	UserRepo userRepo;

	@Autowired UserRepo usrRepo;
	@PostMapping("/add")
	public String add(@RequestBody(required = false) String body)
	throws Exception {
		try {
			//Objet mapper
			ObjectMapper mapper = new ObjectMapper();
			//Conversion des données en getter-setter
			JsonNode map = mapper.readTree(body);

			//Nouveau modèle
			User userCreate=new User();

			//Prise des infos de l'utilisateur
			String user = map.get("username").asText();
			String email = map.get("email").asText();
			String password = map.get("password").asText();

			//Prise du salt
			byte[] salt = userCreate.getSalt();
			//Hashage en sha512 du password
			String hashPwd = userCreate.hashPassword(password, salt);

			//Mise dans le modèle
			userCreate.setUsername(user);
			userCreate.setEmail(email);
			userCreate.setPassword(hashPwd);

			userCreate.setCreated_at(new Date());
			userCreate.setRegistered_at(new Date());

			//Sauvegarde dans la BDD
			userRepo.save(userCreate);

			return "User created successfully.";
		} catch (Exception e) {
			return e.getMessage();
		}
  }
}
