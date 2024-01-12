package com.example.pamiw.service;

import com.example.pamiw.model.*;
import com.example.pamiw.repository.UserRepository;
import com.example.pamiw.shared.AuthenticationRequest;
import com.example.pamiw.shared.AuthenticationResponse;
import com.example.pamiw.shared.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
}
