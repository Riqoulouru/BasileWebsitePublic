package basile.newcv.controller;

import basile.newcv.entity.Lobby;
import basile.newcv.repository.LobbyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lobbies")
public class LobbyController {

    @Autowired
    public LobbyRepository lobbyRepository;


    @PostMapping("/create")
    public Lobby createLobby(@RequestBody Lobby lobby) {
        return lobbyRepository.save(lobby);
    }

    @GetMapping("/{lobbyId}")
    public Lobby getLobby(@PathVariable Long lobbyId) {
        return lobbyRepository.findById(lobbyId)
                .orElse(null);
    }

    @GetMapping("/getAll")
    public List<Lobby> getAll() {
        return lobbyRepository.findAll();
    }


    @PutMapping("/start/{lobbyId}")
    public Lobby startLobby(@PathVariable Long lobbyId) {
        Lobby lobby = lobbyRepository.findById(lobbyId)
                .orElseThrow(() -> new RuntimeException("Lobby not found"));

        // Vos logiques de démarrage du lobby ici

        lobby.setStarted(true);
        lobbyRepository.save(lobby);

        return lobby;
    }

    @PutMapping("/stop/{lobbyId}")
    public Lobby stopLobby(@PathVariable Long lobbyId) {
        Lobby lobby = lobbyRepository.findById(lobbyId)
                .orElseThrow(() -> new RuntimeException("Lobby not found"));

        // Vos logiques d'arrêt du lobby ici

        lobby.setStarted(false);
        lobbyRepository.save(lobby);

        return lobby;
    }

    @DeleteMapping("/{lobbyId}")
    public void deleteLobby(@PathVariable Long lobbyId) {
        lobbyRepository.deleteById(lobbyId);
    }
}
