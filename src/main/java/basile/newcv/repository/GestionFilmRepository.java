package basile.newcv.repository;

import basile.newcv.entity.GestionFilm;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GestionFilmRepository extends CrudRepository<GestionFilm, Long> {
    List<GestionFilm> findByUserUsername(String username);

}