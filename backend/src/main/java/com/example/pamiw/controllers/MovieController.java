package com.example.pamiw.controllers;

import com.example.pamiw.model.Movie;
import com.example.pamiw.shared.ServiceResponse;
import com.example.pamiw.service.MovieService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

import static org.apache.el.lang.ELArithmetic.isNumber;

@RestController
@RequestMapping("/api/v1/movies")
@CrossOrigin(origins = "http://localhost:4200")
public class MovieController {
    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping("/all")
    public ServiceResponse<Page<Movie>>getMovies(@RequestParam Optional<String> title,
                                                    @RequestParam Optional<Integer> page,
                                                    @RequestParam Optional<Integer> size) {
        Page<Movie> moviePage = movieService.getMovies(title.orElse(""), page.orElse(0), size.orElse(5));
        return new ServiceResponse<>(moviePage, true, "success");
    }

    @GetMapping("/{id}")
    public ServiceResponse<Movie> getMovieById(@PathVariable("id") Long id) {
        if (!isNumber(id)) {
            return new ServiceResponse<>(null, false, "ID must be a number!");
        }

        Optional<Movie> movie = movieService.getMovieById(id);
        return new ServiceResponse<>(movie.get(), true, "succees");
    }

    @PostMapping("/add")
    public ServiceResponse<Movie> addMovie(@RequestBody Movie movie) {
        if(movie == null || movie.getTitle() == null || movie.getDirector() == null || movie.getYearOfRelease() == 0 ) {
            return new ServiceResponse<>(null, false, "Fields cannot be null");
        }
        if(movie.getYearOfRelease() > 2023) {
            return new ServiceResponse<>(null, false, "Movie's release date cannot be in the future!");
        }

        return movieService.addMovie(movie);
    }

    @DeleteMapping("/delete/{id}")
    public ServiceResponse<Movie> deleteMovie(@PathVariable("id") Long id) {
        if (!isNumber(id)) {
            return new ServiceResponse<>(null, false, "ID must be a number!");
        }
        return this.movieService.deleteMovie(id);
    }

    @PutMapping("/update")
    public ServiceResponse<Movie> updateMovie(@RequestBody Movie movie) {
        if (!isNumber(movie.getId()) || movie.getId() == null) {
            return new ServiceResponse<>(null, false, "Id must be a number");
        }
        return movieService.updateMovie(movie);
    }

}
