package basile.newcv.controller;

import net.minidev.json.JSONObject;
import org.skyscreamer.jsonassert.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import basile.newcv.entity.JwtRequest;
import basile.newcv.entity.JwtResponse;
import basile.newcv.service.JwtService;
@RestController
@CrossOrigin
public class JwtController {

    @Autowired
    private JwtService jwtService;

    @PostMapping({"/login"})
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> createJwtToken(@RequestBody JwtRequest jwtRequest) throws Exception {
        JwtResponse jwtResponse = jwtService.createJwtToken(jwtRequest);

        // Créer un objet JSON personnalisé avec le nom d'utilisateur et le token
        JSONObject json = new JSONObject();
        json.put("username", jwtResponse.getUser().getUsername());
        json.put("jwtToken", jwtResponse.getJwtToken());

        // Retourner la réponse avec l'objet JSON
        return ResponseEntity.ok(json.toString());
    }
    @GetMapping({"/verifyIfLogin"})
    @PreAuthorize("hasRole('User')")
    public ResponseEntity<?> verifyIfLogin() {
        return ResponseEntity.ok("ok is logged");
    }

    @GetMapping({"/getUsername"})
    @PreAuthorize("hasRole('User')")
    public ResponseEntity<?> getUsername(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(jwtService.getUserNameFromToken(token));
    }




}
