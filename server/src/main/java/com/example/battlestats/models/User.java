package com.example.battlestats.models;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private String username;
  private String email;
  private String password;
  private Date registered_at;

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

  /* -------------- Setters -------------- */

  public void setUsername(String username) {
    this.username=username;
  }

  public void setEmail(String email) {
    this.email=email;
  }

  public void setPassword(String password) {
    this.password=password;
  }

  public void setRegistered_at(Date registered_at) {
    this.registered_at=registered_at;
  }
}
