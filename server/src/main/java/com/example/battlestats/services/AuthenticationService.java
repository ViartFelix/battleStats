package com.example.battlestats.services;

import com.example.battlestats.dtos.LoginUserDto;
import com.example.battlestats.dtos.RegisterUserDto;
import com.example.battlestats.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.battlestats.models.User;

@Service
public class AuthenticationService {
	private final UserRepository userRepository;

	private final PasswordEncoder passwordEncoder;

	private final AuthenticationManager authenticationManager;

	public AuthenticationService(
		UserRepository userRepository,
		AuthenticationManager authenticationManager,
		PasswordEncoder passwordEncoder
	) {
		this.authenticationManager = authenticationManager;
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public User signup(RegisterUserDto input) {
		User user = new User();
		user.setUsername(input.getUsername());
		user.setPassword(passwordEncoder.encode(input.getPassword()));

		return userRepository.save(user);
	}

	public User authenticate(LoginUserDto input) {
		authenticationManager.authenticate(
			new UsernamePasswordAuthenticationToken(
				input.getUsername(),
				input.getPassword()
			)
		);

		return userRepository.findByUsername(input.getUsername()).orElseThrow();
	}
}
