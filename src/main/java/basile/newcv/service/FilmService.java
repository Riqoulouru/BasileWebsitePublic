package basile.newcv.service;

import basile.newcv.entity.Film;
import basile.newcv.entity.GestionFilm;
import basile.newcv.repository.GestionFilmRepository;
import basile.newcv.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FilmService {

    @Autowired
    private GestionFilmRepository gestionFilmRepository;

    public List<GestionFilm> obtenirFilmsParUtilisateur(String username) {
        return gestionFilmRepository.findByUserUsername(username);
    }
    // ...
}