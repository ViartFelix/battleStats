package com.example.battlestats.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.example.battlestats.exceptions.ProfileException;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.util.JSONPObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
	public ResponseEntity add(@RequestBody(required = false) String body) {
        try {
            //Objet mapper
			ObjectMapper mapper = new ObjectMapper();
            //Conversion des données en getter-setter
            JsonNode map = mapper.readTree(body);

            //Nouveau modèle
            User userCreate = new User();

			String email = map.get("email").asText().trim();
            if (!userRepo.findByEmail(email).isEmpty()) {
                throw new ProfileException("User already exists");
            }

            //Prise des infos de l'utilisateur
            String user = map.get("username").asText();
            String password = map.get("password").asText();

            //Hashage en sha512 du password
            String hashPwd = userCreate.hashPassword(password, userCreate.getSalt());

            //Mise dans le modèle
            userCreate.setUsername(user);
            userCreate.setEmail(email);
            userCreate.setPassword(hashPwd);

            userCreate.setCreated_at(new Date());
            userCreate.setRegistered_at(new Date());

            //Sauvegarde dans la BDD
            userRepo.save(userCreate);

			Map<String, Object> mapOk = new HashMap<>();
			mapOk.put("status", true);
			mapOk.put("message", "User created successfully.");

			return new ResponseEntity(mapOk, HttpStatus.OK);
        } catch (ProfileException e) {
			Map<String, Object> map = new HashMap<>();
			map.put("status", false);
			map.put("message", e.getMessage());

			return new ResponseEntity(map, HttpStatus.INTERNAL_SERVER_ERROR);
		} catch (Exception e) {
			Map<String, Object> map = new HashMap<>();
			map.put("status", false);
			map.put("message", "An unknown error occured.");

			return new ResponseEntity(map, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
