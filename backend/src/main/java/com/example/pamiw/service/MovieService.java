package com.example.pamiw.service;

import com.example.pamiw.model.Movie;
import com.example.pamiw.shared.ServiceResponse;
import com.example.pamiw.repository.MovieRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Transactional
public class MovieService {
    private final MovieRepo movieRepo;
    @Autowired
    public MovieService(MovieRepo movieRepo) {
        this.movieRepo = movieRepo;
    }

    public Page<Movie> getMovies(String title, int page, int size) {
        return movieRepo.findByTitleContaining(title, PageRequest.of(page, size));
    }

    public Optional<Movie> getMovieById(Long id) {
        return movieRepo.findById(id);
    }

    public ServiceResponse<Movie> addMovie(Movie movie) {
            try {
                movieRepo.save(movie);
                return new ServiceResponse<Movie>(movie, true, "Movie added!");
            } catch (Exception e) {
                return new ServiceResponse<Movie>(null, false, "Cannot add movie!");
            }
    }

    public ServiceResponse<Movie> deleteMovie (Long id) {
        if (movieRepo.findById(id).isPresent()) {
            try {
                movieRepo.deleteById(id);
                return new ServiceResponse<Movie>(null, true, "Movie deleted");
            } catch (Exception e) {
                return new ServiceResponse<Movie>(null, false, "Cannot delete movie");
            }
        } else return new ServiceResponse<Movie>(null, false, "Couldn't find movie in DB");
    }

    public ServiceResponse<Movie> updateMovie( Movie movie ) {
        if (movieRepo.findById(movie.getId()).isPresent()) {
            try {
                movieRepo.save(movie);
                return new ServiceResponse<Movie>(movie, true, "Movie updated");
            } catch (Exception e) {
                return new ServiceResponse<Movie>(null, false, "Error while updating movie");
            }
        } else return new ServiceResponse<Movie>(null, false, "Movie is not present in DB");

    }
}
