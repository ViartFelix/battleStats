package com.example.battlestats.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.servlet.http.HttpServletRequest;

@Controller
public class CustomErrorController implements ErrorController {
  @RequestMapping("/error")
  @ResponseBody
  String error(HttpServletRequest request) {
    return "Error: "+request.toString();
  }

  public String getErrorPath() {
    return "/error";
  }
}