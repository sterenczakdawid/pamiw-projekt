package com.example.pamiw.service;

import com.example.pamiw.model.Director;
import com.example.pamiw.shared.ServiceResponse;
import com.example.pamiw.repository.DirectorRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class DirectorService {
    private final DirectorRepo directorRepo;

    @Autowired
    public DirectorService(DirectorRepo directorRepo) {
        this.directorRepo = directorRepo;
    }

    public Page<Director> getDirectorsPage(String name, int page, int size) {
        return directorRepo.findByNameContaining(name, PageRequest.of(page, size));
    }
    public ServiceResponse<List<Director>> getDirectors() {
        try {
            List<Director> directorList = directorRepo.findAll();
            return new ServiceResponse<List<Director>>(directorList, true, "Directors got");
        } catch (Exception e) {
            return new ServiceResponse<List<Director>>(null, false, "Error fetching directors");
        }
    }


    public ServiceResponse<Director> addDirector(Director director) {
        if (director.getId() != null) {
            if (directorRepo.findById(director.getId()).isPresent()) {
                return new ServiceResponse<>(null, false, "Director is already in the database");
            }
        }

        try {
            directorRepo.save(director);
            return new ServiceResponse<>(director, true, "Director added");
        } catch (Exception e) {
            return new ServiceResponse<>(null, false, "Error during adding director");
        }
    }

    public ServiceResponse<Director> updateDirector(Director director) {
        if (directorRepo.findById(director.getId()).isPresent()) {
            try {
                directorRepo.save(director);
                return new ServiceResponse<Director>(director, true, "Director updated");
            } catch (Exception e) {
                return new ServiceResponse<Director>(null, false, "Error while updating director");
            }
        }
        else return new ServiceResponse<Director>(null, false, "Director is not present in DB");
    }

    public ServiceResponse<Director> deleteDirector(Long id) {
        if (directorRepo.findById(id).isPresent()) {
            try {
                directorRepo.deleteById(id);
                return new ServiceResponse<Director>(null, true, "Director deleted");
            } catch (Exception e) {
                return new ServiceResponse<Director>(null, false, "Cannot delete Director");
            }
        } else return new ServiceResponse<Director>(null, false, "Couldn't find Director in DB");
    }
}
