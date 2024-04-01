package com.example.battlestats.services;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class JwtRequest {
	String username;
	String password;
	String email;
}
