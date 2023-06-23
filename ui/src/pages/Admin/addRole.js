import styles from '@/styles/AddRole.module.scss';
import {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {checkLoginStatus} from "@/utils/auth";

export default function AddRolePage() {
    const [roleNames, setRolesNames] = useState(['']);
    const [users, setUsers] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [error, setError] = useState('');

    let counter = 0;
    // Récupérer le token depuis votre source (par exemple, local storage)
    let token = '';
    try {
        token = localStorage.getItem('jwtToken');
    } catch (e) {
        token = '';
    }


    // Configurer les options de la requête avec le header Authorization
    const options = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    let loggedIn = true;

    useEffect(() => {

        // Récupérer la liste des rôles
        fetch('https://basilethiry.fr/back/role/getAllRoles', options)
            .then(response => response.json())
            .then(data => {
                setRolesNames(data);
                setSelectedRole(data[0].name);
            })
            .catch(error => loggedIn = false);

        // Récupérer la liste des utilisateurs
        fetch('https://basilethiry.fr/back/user/getAllUsername', options)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setUsers(data);
                setSelectedUser(data[0].username);
            })
            .catch(error => loggedIn = false);

    }, []);


    const handleAddRole = async () => {

        const payload = {
            username: selectedUser,
            role: selectedRole,
        };

        try {
            const response = await fetch('https://basilethiry.fr/back/user/addRole', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setError('');
                alert("Le rôle a bien été ajouté à l'utilisateur");
            } else if (response.status === 409) {
                const errorData = await response.text();
                setError(errorData);
            } else {
                const errorData = await response.text();
                setError(errorData);
            }

        } catch (error) {
            setError(error.message);
        }

        console.log(error);


    }


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
        if (isLoggedIn && userRoles.includes("User")) {
            setLoadAuthorized(true);
        } else {
            setLoadAuthorized(false);
        }
    }, [isLoggedIn, userRoles]);

    return (
        <div>
            {loadAuthorized ? (
                <div className={styles.container}>
                    <div className={styles.square}>
                        <h2 className={styles.title}>Ajouter un rôle</h2>
                        {/* Exemple d'affichage des utilisateurs */}
                        <div className={styles.dropdownContainer}>
                            <select className={styles.dropdown} value={selectedUser}
                                    onChange={(e) => {
                                        setSelectedUser(e.target.value);
                                    }
                                    }>
                                {users.map(user => (
                                    <option key={counter++} value={user.username}>{user.username}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.dropdownContainer}>
                            <select className={styles.dropdown} value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}>
                                {!loggedIn && (
                                    <option key={counter++} value="0">Vous devez être connecté pour voir les
                                        rôles</option>
                                )}
                                {roleNames.map(role => (
                                    <option key={counter++} value={role.name}>{role.name}</option>
                                ))}
                            </select>
                        </div>

                        <button className={styles.button} onClick={handleAddRole}>Valider</button>
                        {error && <p className={styles.error}>{error}</p>}
                    </div>
                </div>
            ) : (
                <h1>Vous n'êtes pas autorisé à accéder à cette page</h1>
            )}
        </div>
    );
}