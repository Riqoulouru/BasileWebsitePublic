package basile.newcv.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
public class Film {


    @Id
    private String title;

    @OneToMany(mappedBy = "film")
    private List<GestionFilm> gestionFilms;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<GestionFilm> getGestionFilms() {
        return gestionFilms;
    }

    public void setGestionFilms(List<GestionFilm> gestionFilms) {
        this.gestionFilms = gestionFilms;
    }
}
