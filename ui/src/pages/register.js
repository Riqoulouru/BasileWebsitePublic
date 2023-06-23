import { useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/Register.module.scss';
import { useRouter } from "next/router";


const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async () => {
        if (!username || !password || !confirmPassword) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        try {
            const response = await fetch('https://basilethiry.fr/back/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                // L'utilisateur a été enregistré avec succès, effectuer les actions nécessaires
                await router.push('/login');
            } else if (response.status === 409) {
                const errorMessage = 'L\'utilisateur existe déjà, veuillez en choisir un autre nom ou bien connectez-vous.';
                setError(errorMessage);
            } else {
                setError('Une erreur s\'est produite lors de l\'inscription.');
            }
        } catch (error) {
            setError('Une erreur s\'est produite lors de l\'inscription.');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleRegister();
        }
    };



    return (
        <div className={styles.container}>
            <Link href="/" className={styles.roundedButton} >
                Home
            </Link>
            <div className={`${styles.box} ${error && styles.errorBox}`}>
                <h1 className={styles.title}>Inscription</h1>

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
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirmer le mot de passe"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className={styles.input}
                    />
                    {error && <p className={styles.error}>{error}</p>}
                    <button onClick={handleRegister} className={styles.registerButton}>S'enregistrer</button>
                    <p className={styles.redirectText}>
                        Déjà enregistré ?{' '}
                        <Link href="/login" className={styles.redirectLink}>Connectez-vous ici</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
