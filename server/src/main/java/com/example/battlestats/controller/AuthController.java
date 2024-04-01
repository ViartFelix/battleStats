package com.example.battlestats.controller;

import com.example.battlestats.helpers.JwtHelper;
import com.example.battlestats.repositories.UserRepository;
import com.example.battlestats.services.JwtRequest;
import com.example.battlestats.services.JwtResponse;
import com.example.battlestats.models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("/auth")
public class AuthController {
	@Autowired
	private UserDetailsService userDetailsService;

	@Autowired
	private AuthenticationManager manager;

	@Autowired
	private JwtHelper helper;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	private Logger logger = LoggerFactory.getLogger(AuthController.class);


	@PostMapping("/login")
	public ResponseEntity<JwtResponse> login(@RequestBody JwtRequest request) {
		this.doAuthenticate(request.getUsername(), request.getPassword());

		UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
		String token = this.helper.generateToken(userDetails);

		JwtResponse response = JwtResponse.builder()
			.jwtToken(token)
			.username(userDetails.getUsername()).build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping("/register")
	public ResponseEntity<JwtResponse> register(@RequestBody JwtRequest request) {
		//if user doesn't exist
		if(!userRepository.existsByUsername(request.getUsername())) {
			User user = new User();
			user.setUsername(request.getUsername());
			user.setEmail(request.getEmail());
			user.setPassword(passwordEncoder.encode(request.getPassword()));
			user.setCreated_at(new Date());

			this.userRepository.save(user);
			return new ResponseEntity<>(HttpStatus.CREATED);
		} else {
			return new ResponseEntity<>(HttpStatus.FORBIDDEN);
		}
	}

	private void doAuthenticate(String email, String password) {

		UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(email, password);
		try {
			manager.authenticate(authentication);
		} catch (BadCredentialsException e) {
			throw new BadCredentialsException(" Invalid Username or Password  !!");
		}

	}

	@ExceptionHandler(BadCredentialsException.class)
	public String exceptionHandler() {
		return "Credentials Invalid !!";
	}

}
