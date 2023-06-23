package basile.newcv.repository;

import basile.newcv.entity.Lobby;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LobbyRepository extends JpaRepository<Lobby, Long> {
    // Ajoutez ici des méthodes personnalisées si nécessaire
}
