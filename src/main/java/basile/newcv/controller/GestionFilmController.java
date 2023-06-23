package basile.newcv.controller;

import basile.newcv.DTO.FilmEtatDTO;
import basile.newcv.DTO.UsernameTitleDTO;
import basile.newcv.entity.GestionFilm;
import basile.newcv.repository.GestionFilmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/gestionFilm")
public class GestionFilmController {

    @Autowired
    private GestionFilmRepository gestionFilmRepository;

    @GetMapping("/getAllFilmsTitleAndUsernames")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<?> getAllFilmsAndUsernames() {
        List<UsernameTitleDTO> films = new ArrayList<>();

        for (GestionFilm gestionFilm : gestionFilmRepository.findAll()) {
            if (gestionFilm.getEtat().equals("Demandé")) {
                String username = gestionFilm.getUser().getUsername();
                String title = gestionFilm.getFilm().getTitle();
                films.add(new UsernameTitleDTO(username, title));
            }
        }
        return ResponseEntity.status(HttpStatus.OK).body(films);
    }
}
