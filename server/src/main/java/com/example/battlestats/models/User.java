package com.example.battlestats.models;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Date;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	private String username;
	private String email;

	private String password;
	private Date registered_at;
	private Date created_at;

	/* -------------- Actions -------------- */

	public String hashPassword(String password) throws NoSuchAlgorithmException {
		String generatedPwd = null;

		MessageDigest md = MessageDigest.getInstance("SHA-512");
		//md.update(salt);

		byte[] bytes = md.digest(password.getBytes(StandardCharsets.UTF_8));
		StringBuilder sb = new StringBuilder();

        for (byte aByte : bytes) {
            sb.append(Integer.toString((aByte & 0xff) + 0x100, 16).substring(1));
        }

		generatedPwd = sb.toString();

		return generatedPwd;
	}

	public byte[] getSalt() throws NoSuchAlgorithmException {
		SecureRandom random = new SecureRandom();
		byte[] salt = new byte[16];
		random.nextBytes(salt);
		return salt;
	}
}
