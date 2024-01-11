package com.example.pamiw.repository;

import com.example.pamiw.model.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieRepo extends JpaRepository<Movie, Long> {
    Page<Movie> findByTitleContaining(String title, Pageable pageable);
}
