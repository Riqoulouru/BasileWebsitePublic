import { useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/Login.module.scss';
import {useRouter} from "next/router";
import {getUserRoles} from "@/utils/auth";
import {console} from "next/dist/compiled/@edge-runtime/primitives/console";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const handleLogin = async () => {
        try {
            const response = await fetch('https://basilethiry.fr/back/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                // L'utilisateur est connecté avec succès, effectuer les actions nécessaires
                const data = await response.json();
                const jwtToken = data.jwtToken; // Supposons que le JWT est renvoyé dans la propriété "token" de la réponse

                // Stockage du JWT dans le localStorage
                localStorage.setItem('jwtToken', jwtToken);
                localStorage.setItem('username', username);

                const roles = await getUserRoles();
                const roleNames = [];
                console.log(roles.length);
                for (let i = 0; i < roles.length; i++) {
                    roleNames.push(roles[i].name);
                }

                localStorage.setItem('userRole', JSON.stringify(roleNames));

                await router.push('/');

            } else if (response.status === 401) {
                setError('Nom d\'utilisateur ou mot de passe incorrect.');
            } else {
                setError('Une erreur s\'est produite lors de la connexion.');
            }
        } catch (error) {
            setError('Une erreur s\'est produite lors de la connexion.');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };



    return (
        <div className={styles.container}>
            <Link href="/" className={styles.roundedButton} >
                Home
            </Link>
            <div className={styles.box}>
                <h1 className={styles.title}>Connexion</h1>
                <div className={styles.formContainer}>
                    <input
                        type="text"
                        id="username"
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase())}
                        onKeyDown={handleKeyPress}
                        className={styles.input}
                    />
                    <input
                        type="password"
                        id="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className={styles.input}
                    />
                    {error && <p className={styles.error}>{error}</p>}
                    <button onClick={handleLogin} className={styles.registerButton}>Connexion</button>
                    <p className={styles.redirectText}>
                        Pas encore enregistré ?{' '}
                        <Link href="/register" className={styles.redirectLink}>Inscrivez-vous ici</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
