package com.example.pamiw.service;

import com.example.pamiw.model.*;
import com.example.pamiw.repository.UserRepository;
import com.example.pamiw.shared.AuthenticationRequest;
import com.example.pamiw.shared.AuthenticationResponse;
import com.example.pamiw.shared.RegisterRequest;
import com.example.pamiw.shared.ServiceResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.google.api.client.json.JsonFactory;


import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
      var user = User.builder()
          .name(request.getName())
          .email(request.getEmail())
          .password(passwordEncoder.encode(request.getPassword()))
          .role(request.getRole() == null ? Role.USER : request.getRole())
          .build();
        userRepository.save(user);
        String jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
          .token(jwtToken)
          .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(),request.getPassword())
        );
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
          .token(jwtToken)
          .build();
    }

  @Value("${spring.security.oauth2.client.registration.google.client-id}")
  private String clientId;
  private JsonFactory jsonFactory = GsonFactory.getDefaultInstance();
  public AuthenticationResponse logInWithGoogle(String token) {
    token = token.replace("\"", "");
    GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), jsonFactory)
      .setAudience(Collections.singletonList(clientId))
      .build();

    try {
      GoogleIdToken googleIdToken = verifier.verify(token);
      if (googleIdToken != null) {
        GoogleIdToken.Payload payload = googleIdToken.getPayload();

        // Sprawdź, czy użytkownik już istnieje w bazie danych
        Optional<User> existingUser = userRepository.findByEmail(payload.getEmail());

        if (existingUser.isPresent()) {
          // Użytkownik istnieje, generuj token JWT
          User user = existingUser.get();
          String jwtToken = jwtService.generateToken(user);
          return AuthenticationResponse.builder()
            .token(jwtToken)
            .build();
        } else {
          User newUser = User.builder()
            .email(payload.getEmail())
            .role(Role.USER)
            .build();
          userRepository.save(newUser);

          // Następnie generuj token JWT dla nowego użytkownika
          String jwtToken = jwtService.generateToken(newUser);
          return AuthenticationResponse.builder()
            .token(jwtToken)
            .build();
        }
      } else {
        return null;
      }
    } catch (GeneralSecurityException | IOException e) {
      e.printStackTrace();
      return null;
    }
  }
}
