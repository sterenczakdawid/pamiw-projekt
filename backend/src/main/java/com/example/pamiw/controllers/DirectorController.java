package com.example.pamiw.controllers;

import com.example.pamiw.model.Director;
import com.example.pamiw.shared.ServiceResponse;
import com.example.pamiw.service.DirectorService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/directors")
@CrossOrigin(origins = "http://localhost:4200")
public class DirectorController {

    private final DirectorService directorService;

    public DirectorController(DirectorService directorService) {
        this.directorService = directorService;
    }

    @GetMapping("/all")
    public ServiceResponse<Page<Director>>getAllDirectors(@RequestParam Optional<String> name,
                                                    @RequestParam Optional<Integer> page,
                                                    @RequestParam Optional<Integer> size) {
        Page<Director> directorPage = directorService.getDirectorsPage(name.orElse(""), page.orElse(0), size.orElse(5));
        return new ServiceResponse<>(directorPage, true, "success");
    }

    @GetMapping("/allp")
    public ServiceResponse<List<Director>> getDirectors() {
        return directorService.getDirectors();
    }

    @PostMapping("/add")
    public ServiceResponse<Director> addDirector(@RequestBody Director director) {
        if(director == null || director.getName() == null || director.getSurname() == null) {
            return new ServiceResponse<>(null, false, "Fields cannot be null");
        }

        return directorService.addDirector(director);
    }

    @DeleteMapping("/delete/{id}")
    public ServiceResponse<Director> deleteDirector(@PathVariable("id") Long id) {
        if (id == null) {
            return new ServiceResponse<>(null, false, "ID cannot be null!");
        }
        return this.directorService.deleteDirector(id);
    }

    @PutMapping("/update")
    public ServiceResponse<Director> updateDirector(@RequestBody Director director) {
        if (director.getId() == null) {
            return new ServiceResponse<>(null, false, "Id cannot be null");
        }
        return directorService.updateDirector(director);
    }

}
