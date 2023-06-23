package basile.newcv.service;

import basile.newcv.entity.Film;
import basile.newcv.entity.GestionFilm;
import basile.newcv.entity.Role;
import basile.newcv.entity.User;
import basile.newcv.repository.FilmRepository;
import basile.newcv.repository.RoleRepository;
import basile.newcv.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FilmRepository filmRepository;

    public void initRoleAndUser() {

        Role adminRole = new Role();
        adminRole.setName("Admin");
        adminRole.setDescription("Admin role");
        roleRepository.save(adminRole);

        Role modRole = new Role();
        modRole.setName("Moderateur");
        modRole.setDescription("Modérateur role");
        roleRepository.save(modRole);

        Role folleHistoire = new Role();
        folleHistoire.setName("FolleHistoire");
        folleHistoire.setDescription("Accès à la folle Histoire");
        roleRepository.save(folleHistoire);

        Role userRole = new Role();
        userRole.setName("User");
        userRole.setDescription("Default role for newly created record");
        roleRepository.save(userRole);

        Role plexUser = new Role();
        plexUser.setName("PlexUser");
        plexUser.setDescription("User that have access to plex and can ask new movie / series");
        roleRepository.save(plexUser);

        Role plexAdmin = new Role();
        plexAdmin.setName("PlexAdmin");
        plexAdmin.setDescription("User that can add Movie & Series to plex");
        roleRepository.save(plexAdmin);

        User adminUser = new User();
        adminUser.setUsername("admin");
        adminUser.setPassword(getEncodedPassword("PASSWORD"));
        adminUser.setRole(new HashSet<>());
        adminUser.addRole(adminRole);
        adminUser.addRole(userRole);
        adminUser.addRole(plexUser);
        adminUser.addRole(modRole);
        adminUser.addRole(plexAdmin);
        adminUser.addRole(folleHistoire);
        userRepository.save(adminUser);


        User testUser = new User();
        testUser.setUsername("test");
        testUser.setPassword(getEncodedPassword("PASSWORD"));
        testUser.setRole(new HashSet<>());
        testUser.addRole(userRole);
        testUser.addRole(plexUser);
        userRepository.save(testUser);

    }

    public User registerNewUser(User user) {
        Role role = roleRepository.findById("User").get();
        Set<Role> userRoles = new HashSet<>();
        userRoles.add(role);
        user.setRole(userRoles);
        user.setPassword(getEncodedPassword(user.getPassword()));

        return userRepository.save(user);
    }

    public String getEncodedPassword(String password) {
        return passwordEncoder.encode(password);
    }



}


