package basile.newcv.controller;

import basile.newcv.DTO.FilmEtatDTO;
import basile.newcv.DTO.UserNameDTO;
import basile.newcv.entity.Film;
import basile.newcv.entity.GestionFilm;
import basile.newcv.entity.Role;
import basile.newcv.entity.User;
import basile.newcv.repository.FilmRepository;
import basile.newcv.repository.GestionFilmRepository;
import basile.newcv.repository.RoleRepository;
import basile.newcv.repository.UserRepository;
import basile.newcv.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.net.*;
import java.util.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private FilmRepository filmRepository;

    @Autowired
    private GestionFilmRepository gestionFilmRepository;

    @PostConstruct
    public void initRoleAndUser() {
        userService.initRoleAndUser();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        User userExists = userRepository.findById(user.getUsername()).orElse(null);

        if (userExists != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists");
        }

        userService.registerNewUser(user);
        return ResponseEntity.ok(user.toString());
    }

    @GetMapping({"/forAdmin"})
    @PreAuthorize("hasRole('Admin')")
    public String forAdmin() {
        return "This URL is only accessible to the admin";
    }

    @GetMapping({"/forUser"})
    @PreAuthorize("hasRole('User')")
    public String forUser() {
        return "This URL is only accessible to the user";
    }

    @GetMapping("/getAllUsername")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<?> getAll() {
        Iterable<User> all = userRepository.findAll();
        List<UserNameDTO> userDTOList = new ArrayList<>();
        for (User user : all) {
            UserNameDTO userDTO = new UserNameDTO(user.getUsername());
            userDTOList.add(userDTO);
        }

        ObjectMapper objectMapper = new ObjectMapper();
        String json;
        try {
            json = objectMapper.writeValueAsString(userDTOList);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.status(HttpStatus.OK).body(json);
    }

    @PostMapping({"/addRole"})
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<?> addRole(@RequestBody Map<String, String> body) {
        User userExists = userRepository.findById(body.get("username")).orElse(null);

        if (userExists == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User doesn't exists");
        }

        Set<Role> roles = userExists.getRole();

        for (Role role : roles) {
            if (role.getName().equals(body.get("role"))) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("User already has this role");
            }
        }

        Role newRole = roleRepository.findById(body.get("role")).orElse(null);

        if (newRole == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Role doesn't exists");
        }
        userExists.addRole(newRole);
        userRepository.save(userExists);
        return ResponseEntity.ok(userExists.toString());
    }

    @PostMapping({"/removeRole"})
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<?> removeole(@RequestBody Map<String, String> body) {
        User userExists = userRepository.findById(body.get("username")).orElse(null);

        if (userExists == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User doesn't exists");
        }

        Set<Role> roles = userExists.getRole();

        for (Role role : roles) {
            if (role.getName().equals(body.get("role"))) {
                userExists.removeRole(role);
                userRepository.save(userExists);
                return ResponseEntity.ok("Role supprimé");
            }
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body("User doesn't have this role");
    }

    @PostMapping({"/getRole"})
    @PreAuthorize("hasRole('User')")
    public ResponseEntity<?> getRole(@RequestBody Map<String, String> body) {

        User userExists = userRepository.findById(body.get("username")).orElse(null);

        if (userExists == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User doesn't exists");
        }


        return ResponseEntity.ok(userExists.getRole());

    }

    private void sendNotification(String message) {
        try {
            java.net.InetAddress localMachine = java.net.InetAddress.getLocalHost();
            ProcessBuilder processBuilder = new ProcessBuilder("curl", "-H", "X-Priority:", "1", "-d", message, "ntfy.sh/BasileWebSite");
            processBuilder.start();


        } catch (UnknownHostException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }


    }

    @PostMapping({"/demandeFilm"})
    @PreAuthorize("hasRole('User')")
    public ResponseEntity<?> addFilm(@RequestBody Map<String, String> body) {

        String nomFilm = body.get("title");

        if (nomFilm == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("title is null");
        }

        User user = userRepository.findByUsername(body.get("username"));
        Film film = filmRepository.findByTitle(nomFilm);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User doesn't exists");
        }

        sendNotification("Demande de film : " + nomFilm + " par " + user.getUsername());

        if (film == null) {
            film = new Film();
            film.setTitle(nomFilm);
            filmRepository.save(film);
        }

        for (GestionFilm gestionFilm : user.getGestionFilms()) {
            String titre = gestionFilm.getFilm().getTitle();

            if (titre.equals(film.getTitle())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Film déjà présent");
            }
        }

        GestionFilm gestionFilm = new GestionFilm(user, film, "Demandé");

        user.getGestionFilms().add(gestionFilm);
        userRepository.save(user);
        gestionFilmRepository.save(gestionFilm);

        return ResponseEntity.status(HttpStatus.OK).body("Film ajouté");
    }

    @PostMapping({"/getAllDemandes"})
    @PreAuthorize("hasRole('User')")
    public ResponseEntity<?> getAllDemandes(@RequestBody Map<String, String> body) {

        User user = userRepository.findByUsername(body.get("username"));

        if (user == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User doesn't exists");
        }

        List<FilmEtatDTO> films = new ArrayList<>();

        for (GestionFilm gestionFilm : user.getGestionFilms()) {
            String titre = gestionFilm.getFilm().getTitle();
            String etat = gestionFilm.getEtat();

            films.add(new FilmEtatDTO(titre, etat));
        }

        return ResponseEntity.status(HttpStatus.OK).body(films);
    }

    @PostMapping({"/deleteDemande"})
    @PreAuthorize("hasRole('User')")
    public ResponseEntity<?> deleteDemande(@RequestBody Map<String, String> body) {

        User user = userRepository.findByUsername(body.get("username"));
        Film film = filmRepository.findByTitle(body.get("title"));

        if (user == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User doesn't exists");
        }

        if (film == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Film doesn't exists");
        }

        for (GestionFilm gestionFilm : user.getGestionFilms()) {
            String titre = gestionFilm.getFilm().getTitle();

            if (titre.equals(film.getTitle())) {
                user.getGestionFilms().remove(gestionFilm);
                gestionFilmRepository.delete(gestionFilm);
                userRepository.save(user);
                return ResponseEntity.status(HttpStatus.OK).body("Film supprimé");
            }
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body("Film non présent");
    }

    @PostMapping({"/updateDemande"})
    @PreAuthorize("hasRole('User')")
    public ResponseEntity<?> updateDemande(@RequestBody Map<String, String> body) {

        User user = userRepository.findByUsername(body.get("username"));
        Film film = filmRepository.findByTitle(body.get("title"));

        if (user == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User doesn't exists");
        }

        if (film == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Film doesn't exists");
        }

        for (GestionFilm gestionFilm : user.getGestionFilms()) {
            String titre = gestionFilm.getFilm().getTitle();

            if (titre.equals(film.getTitle())) {
                gestionFilm.setEtat(body.get("etat"));
                gestionFilmRepository.save(gestionFilm);
                return ResponseEntity.status(HttpStatus.OK).body("Film modifié");
            }
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body("Film non présent");
    }

}
