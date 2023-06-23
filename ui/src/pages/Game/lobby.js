import {useEffect, useState} from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import styles from '@/styles/Lobby.module.scss';
import { useRouter } from 'next/router';

export default function Lobby() {
    const [lobbies, setLobbies] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState('');
    const [selectedGameType, setSelectedGameType] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();


    useEffect(() => {
        fetchLobbies();
    }, []);

    const fetchLobbies = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');

            axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;

            const response = await axios.get('/api/lobbies');
            setLobbies(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des lobbies:', error);
        }
    };


    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleCreateGame = async () => {
        if (!selectedGame) {
            setError('Veuillez sélectionner un jeu');
        } else if (selectedGame === 'echecs' && !selectedGameType) {
            setError('Veuillez sélectionner un type de jeu');
        } else {
            setError(null);

            const jwtToken = localStorage.getItem('jwtToken');
            const url = 'https://basilethiry.fr/back/lobbies/create';
            const username = localStorage.getItem('username');

            let maxPlayers;

            // Définir le nombre maximum de joueurs en fonction du jeu choisi
            if (selectedGame === 'echecs') {
                maxPlayers = 2; // Exemple pour les échecs
            } else if (selectedGame === 'paDGame') {
                maxPlayers = 1; // Exemple pour PasGame
            } else {
                // Définir une valeur par défaut si nécessaire
                maxPlayers = 0;
            }

            axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
            const response = await axios.post(url, {
                name: selectedGame + " de " + username,
                gameType: selectedGameType,
                maxPlayers: maxPlayers, // Remplacez par la valeur réelle
                currentPlayers: 1, // Remplacez par la valeur réelle
                started: false, // Remplacez par la valeur réelle
            });

            // Obtenez l'ID du jeu créé à partir de la réponse
            const gameId = response.data.id;

            router.push(`/Game/${gameId}`);
        }
    };


    const handleGameChange = (event) => {
        setSelectedGame(event.target.value);
    };

    const handleGameTypeChange = (event) => {
        setSelectedGameType(event.target.value);
    };

    const joinLobby = (lobbyId) => {
        // Logique pour rejoindre un lobby spécifique
        // Vous pouvez rediriger l'utilisateur vers la page de lobby du jeu sélectionné en utilisant l'ID du lobby
    };

    return (
        <div>
            <h1>Lobby</h1>
            <button onClick={openModal}>Créer un jeu</button>

            <h2>Liste des jeux</h2>
            {lobbies.length > 0 ? (
                <ul>
                    {lobbies.map(lobby => (
                        <li key={lobby.id}>
                            <span>Nom du jeu : {lobby.name} </span>
                            <span>Nombre de joueurs : {lobby.currentPlayers}/{lobby.maxPlayers}</span>
                            <button onClick={() => joinLobby(lobby.id)}>Rejoindre</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucun jeu disponible.</p>
            )}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className={styles.modalBox}
                overlayClassName={styles.modalOverlay}
                contentLabel="Créer un jeu"
            >
                <div className={styles.title}>Créer un jeu</div>
                <div className={styles.formContainer}>

                    <div>
                        <label htmlFor="gameSelect">Sélectionnez le jeu :</label>
                        <select id="gameSelect" value={selectedGame} onChange={handleGameChange}>
                            <option value="">-- Sélectionnez un jeu --</option>
                            <option value="echecs">Echecs</option>
                        </select>
                    </div>
                    {selectedGame === 'echecs' && (
                        <div>
                            <label htmlFor="gameTypeSelect">Type de jeu :</label>
                            <select id="gameTypeSelect" value={selectedGameType} onChange={handleGameTypeChange}>
                                <option value="">-- Sélectionnez un type de jeu --</option>
                                <option value="blitz">Blitz</option>
                                <option value="normal">Normal</option>
                                <option value="long">Long</option>
                            </select>
                        </div>
                    )}
                    {error && <div className={styles.errorMessage}>{error}</div>}

                    <button className={styles.registerButton} onClick={handleCreateGame}>Créer</button>
                </div>
            </Modal>

        </div>
    );
}
