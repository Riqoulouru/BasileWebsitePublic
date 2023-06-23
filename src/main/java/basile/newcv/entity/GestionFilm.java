package basile.newcv.entity;

import org.hibernate.annotations.Table;

import javax.persistence.*;

@Entity
public class GestionFilm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user")
    private User user;
    @ManyToOne
    @JoinColumn(name = "film")
    private Film film;

    private String etat;

    public GestionFilm(User user, Film film, String etat) {
        this.user = user;
        this.film = film;
        this.etat = etat;
    }

    public GestionFilm() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Film getFilm() {
        return film;
    }

    public void setFilm(Film film) {
        this.film = film;
    }

    public String getEtat() {
        return etat;
    }

    public void setEtat(String etat) {
        this.etat = etat;
    }
}