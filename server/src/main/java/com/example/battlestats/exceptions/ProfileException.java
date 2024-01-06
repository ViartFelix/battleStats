package com.example.battlestats.exceptions;

import org.springframework.http.ResponseEntity;

import com.example.battlestats.models.User;

public class ProfileException extends Exception {
  private String errorString;

  public ProfileException (String errorString) {
    super(errorString);
  }

  public void setErrorString(String errorString) {
    this.errorString=errorString;
  }

  public String getErrorString() {
    return this.errorString;
  }

  public ResponseEntity<User> toString() {
    return this.errorString;
  }

}