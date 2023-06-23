import styles from '@/styles/DemandePlex.module.scss';
import Link from 'next/link';
import Modal from 'react-modal';
import {useState, useEffect} from 'react';
import {checkLoginStatus} from "@/utils/auth";
import {useRouter} from "next/router";

Modal.setAppElement('#__next');

const Demande = () => {
    const [demandes, setDemandes] = useState([]);
    const [triTitre, setTriTitre] = useState('asc');
    const [triUser, setTriUser] = useState('asc');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [filmInput, setFilmInput] = useState('');

    let token = '';
    try {
        token = localStorage.getItem('jwtToken');
    } catch (e) {
        token = '';
    }


    const fetchDemandes = async () => {
        try {
            const username = localStorage.getItem('username');
            const response = await fetch('https://basilethiry.fr/back/gestionFilm/getAllFilmsTitleAndUsernames', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setDemandes(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des demandes :', error);
        }
    };


    useEffect(() => {
        fetchDemandes();
    }, []);

    const trierParTitre = () => {
        const triDemandes = [...demandes];

        if (triTitre === 'asc') {
            triDemandes.sort((a, b) => a.title.localeCompare(b.titre));
            setTriTitre('desc');
        } else {
            triDemandes.sort((a, b) => b.title.localeCompare(a.titre));
            setTriTitre('asc');
        }

        setDemandes(triDemandes);
    };

    const trierParUser = () => {
        const triUser = [...demandes];

        if (triUser === 'asc') {
            triUser.sort((a, b) => a.etat.localeCompare(b.etat));
            setTriUser('desc');
        } else {
            triUser.sort((a, b) => b.etat.localeCompare(a.etat));
            setTriUser('asc');
        }

        setDemandes(triUser);
    };


    const demanderFilm = async () => {
        try {
            const username = localStorage.getItem('username');
            if (filmInput === '') {
                alert('Veuillez saisir un nom de film.');
                return;
            }
            const response = await fetch('https://basilethiry.fr/back/user/demandeFilm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({username, title: filmInput}),
            });

            if (response.ok) {
                await fetchDemandes(); // Mettre à jour le tableau demandes
            } else {
                console.error('Erreur lors de la demande du film :', response.status);
            }
        } catch (error) {
            console.error('Erreur lors de la demande du film :', error);
        }

        setFilmInput('');
        setDialogOpen(false);
    };


    const signalerCommeAjoute = async (index) => {
        try {
            const demande = demandes[index];

            const title = demande.title;
            const username = localStorage.getItem('username');
            const response = await fetch('https://basilethiry.fr/back/user/updateDemande', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({username, title: title, etat: "En ligne"}),
            });

            if (response.ok) {
                await fetchDemandes(); // Mettre à jour le tableau demandes
            } else {
                console.error('Erreur à la modification de l\'état :', response.status);
            }

        } catch (error) {
            console.error('Erreur à la modification de l\'état :', error);
        }


    };

    const ouvrirDialog = () => {
        setDialogOpen(true);
    };

    const fermerDialog = () => {
        demanderFilm();
    };

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRoles, setUserRoles] = useState([]);
    const [loadAuthorized, setLoadAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchLoginStatus = async () => {
            const loggedIn = await checkLoginStatus();
            setIsLoggedIn(loggedIn);
            const roles = localStorage.getItem('userRole');
            if (roles != null) {
                setUserRoles(localStorage.getItem('userRole'));
            }
        };

        fetchLoginStatus().then(r => {
            }
        );
    }, []);

    // Vérification de la connexion et des rôles utilisateur avant de charger la page
    useEffect(() => {
        if (isLoggedIn && userRoles.includes("PlexUser")) {
            setLoadAuthorized(true);
        } else {
            setLoadAuthorized(false);
        }
    }, [isLoggedIn, userRoles]);


    return (
        <div>
            {loadAuthorized ? (
                <div>
                    <div className={styles.navbar}>
                        <ul className={styles.navbarList}>
                            <li>
                                <Link href="/Admin/adminHub">AdminHub</Link>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.container}>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th onClick={trierParUser}>User</th>
                                <th onClick={trierParTitre}>Titre</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {demandes.map((demande, index) => (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? styles.evenRow : styles.oddRow}
                                >
                                    <td>{demande.username}</td>
                                    <td>{demande.title}</td>
                                    <td>
                                        <button
                                            onClick={() => signalerCommeAjoute(index)}
                                        >
                                            Signaler comme ajouté
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <Modal
                        isOpen={dialogOpen}
                        onRequestClose={() => setDialogOpen(false)}
                        className={styles.modalBox}
                        overlayClassName={styles.modalOverlay}
                        contentLabel="Boîte de dialogue"
                    >
                        <div className={styles.title}>Demander un film</div>
                        <div className={styles.formContainer}>
                            <input
                                type="text"
                                value={filmInput}
                                onChange={(e) => setFilmInput(e.target.value)}
                                placeholder="Nom du film"
                                className={`${styles.input} ${styles.roundedInput}`}
                            />
                            <button onClick={fermerDialog} className={styles.registerButton}>
                                Valider
                            </button>
                        </div>
                    </Modal>
                </div>

            ) : (
                <h1>Vous n'êtes pas autorisé à accéder à cette page</h1>
            )}
        </div>
    );
};

export default Demande;
