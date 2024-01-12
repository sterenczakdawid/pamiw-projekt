package com.example.pamiw.controllers;

import com.example.pamiw.shared.AuthenticationRequest;
import com.example.pamiw.shared.AuthenticationResponse;
import com.example.pamiw.shared.RegisterRequest;
import com.example.pamiw.shared.ServiceResponse;
import com.example.pamiw.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ServiceResponse<AuthenticationResponse> register(@RequestBody RegisterRequest request){
        return new ServiceResponse<>(this.authenticationService.register(request),true,"User successfully registered");

    }
    @PostMapping("/authenticate")
    public ServiceResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request){
        return new ServiceResponse<>(this.authenticationService.authenticate(request),true,"User successfully authenticated");
    }


  @PostMapping("/google")
  public ServiceResponse<AuthenticationResponse> authenticate(@RequestBody String token){
    AuthenticationResponse response = this.authenticationService.logInWithGoogle(token);
    System.out.println("Received token from backend: " + response != null ? response.getToken() : "null");
    if (response != null) {
      return new ServiceResponse<>(response, true, "User successfully authenticated with google");
    } else {
      return new ServiceResponse<>(null, false, "Failed to authenticate user with google");
    }
  }

}
