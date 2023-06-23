package basile.newcv.controller;


import basile.newcv.entity.Role;
import basile.newcv.repository.RoleRepository;
import basile.newcv.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/role")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @Autowired
    private RoleRepository roleRepository;

    @PostMapping({"/createNewRole"})
    @PreAuthorize("hasRole('Admin')")
    public Role createNewRole(@RequestBody Role role) {
        return roleService.createNewRole(role);
    }

    @GetMapping({"/getAllRoles"})
    @PreAuthorize("hasRole('Admin')")
    public Iterable<Role> getAllRoles() {
        return roleRepository.findAll();
    }


}
