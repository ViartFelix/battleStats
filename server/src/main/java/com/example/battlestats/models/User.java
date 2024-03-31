package com.example.battlestats.models;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Date;

import jakarta.persistence.*;

@Entity

public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	private String username;
	private String email;

	private String password;
	private Date registered_at;
	private Date created_at;

	public User() {
	}

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

	/* -------------- Getters -------------- */

	public Integer getId() {
		return id;
	}

	public String getUsername() {
		return username;
	}

	public String getEmail() {
		return email;
	}

	public String getPassword() {
		return password;
	}

	public Date getRegistered_at() {
		return registered_at;
	}

	public Date getCreated_at() {
		return created_at;
	}

	/* -------------- Setters -------------- */

	public void setUsername(String username) {
		this.username = username;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public void setRegistered_at(Date registered_at) {
		this.registered_at = registered_at;
	}

	public void setCreated_at(Date created_at) {
		this.created_at = created_at;
	}
}
