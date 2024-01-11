package com.example.pamiw.repository;

import com.example.pamiw.model.Director;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DirectorRepo extends JpaRepository<Director, Long> {
    Page<Director> findByNameContaining(String name, Pageable pageable);
}
