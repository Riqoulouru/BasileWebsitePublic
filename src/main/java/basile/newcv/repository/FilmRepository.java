package basile.newcv.repository;

import basile.newcv.entity.Film;
import basile.newcv.entity.GestionFilm;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FilmRepository extends CrudRepository<Film, Long> {
    Film findByTitle(String name);
}
