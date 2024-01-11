package com.example.pamiw.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_DEFAULT;

@Entity
@Data
@NoArgsConstructor
@JsonInclude(NON_DEFAULT)
public class Movie implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;
    private String title;
    @ManyToOne
    @JoinColumn(name = "director_id")
    private Director director;
    private int yearOfRelease;
    private String posterUrl;
    private String description;
}
