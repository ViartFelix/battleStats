package com.example.battlestats.dtos;

import com.example.battlestats.models.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
	private String token;
	private long expiresIn;
	private User user;
}
