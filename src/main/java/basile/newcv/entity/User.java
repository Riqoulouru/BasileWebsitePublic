package basile.newcv.entity;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Entity
public class User {

    @Id
    private String username;
    private String email;
    private String password;
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "USER_ROLE",
            joinColumns = {
                    @JoinColumn(name = "USER_ID")
            },
            inverseJoinColumns = {
                    @JoinColumn(name = "ROLE_ID")
            }
    )
    private Set<Role> role;

    @OneToMany(mappedBy = "user")
    private List<GestionFilm> gestionFilms;

    public String getUsername() {
        return username;
    }

    public void setUsername(String userName) {
        this.username = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String userPassword) {
        this.password = userPassword;
    }

    public Set<Role> getRole() {
        return role;
    }

    public void setRole(Set<Role> role) {
        this.role = role;
    }

    public void addRole(Role role) {
        if(this.role.contains(role)) {
            return;
        }
        this.role.add(role);

    }

    public List<GestionFilm> getGestionFilms() {
        return gestionFilms;
    }

    public void setGestionFilms(List<GestionFilm> gestionFilms) {
        this.gestionFilms = gestionFilms;
    }

    public void addGestionFilm(GestionFilm gestionFilm) {
        this.gestionFilms.add(gestionFilm);
    }

    @Override
    public String toString() {
        return "User{" +
                "username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", role=" + role +
                '}';
    }

    public void removeRole(Role role) {
        this.role.remove(role);
    }
}
