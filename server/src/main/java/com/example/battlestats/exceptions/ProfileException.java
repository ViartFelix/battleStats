package com.example.battlestats.exceptions;

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

  public String toString() {
    return this.errorString;
  }

}