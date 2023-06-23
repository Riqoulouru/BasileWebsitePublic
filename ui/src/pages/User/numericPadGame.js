import React, {useState, useEffect} from 'react';
import styles from '@/styles/NumericPad.module.scss';
import Link from 'next/link';
import RoundedButton from "@/pages/Component/RoundedButton/RoundedButton";
import {useRouter} from "next/router";
import {checkLoginStatus} from "@/utils/auth";

export default function NumericPadGame() {
    const [litNumbers, setLitNumbers] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [intervalDuration, setIntervalDuration] = useState(2000);
    const [activeNumber, setActiveNumber] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const saveScore = async () => {
        const token = localStorage.getItem('jwtToken');
        const username = localStorage.getItem('username');

        const url = 'https://basilethiry.fr/back/numericPadScore/saveScore';
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
        const body = JSON.stringify({
            username: username,
            score: score,
        });

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: body,
            });

            if (response.ok) {
                console.log('Score saved successfully');
                updateLeaderboard();
            } else {
                console.log('Failed to save score');
            }
        } catch (error) {
            console.log('Error saving score:', error);
        }
    };

    const updateLeaderboard = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const url = 'https://basilethiry.fr/back/numericPadScore/leaderboard';
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await fetch(url, {
                method: 'GET',
                headers: headers,
            });

            if (response.ok) {
                const data = await response.json();
                setLeaderboard(data);
            } else {
                console.log('Failed to fetch leaderboard');
            }
        } catch (error) {
            console.log('Error fetching leaderboard:', error);
        }
    };

    const fetchLeaderboard = async () => {
        const token = localStorage.getItem('jwtToken');
        const url = 'https://basilethiry.fr/back/numericPadScore/leaderboard';
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: headers,
            });

            if (response.ok) {
                const data = await response.json();
                setLeaderboard(data);
            } else {
                console.log('Failed to fetch leaderboard');
            }
        } catch (error) {
            console.log('Error fetching leaderboard:', error);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    useEffect(() => {
        if (gameStarted) {
            const interval = setInterval(() => {
                let randomNum;
                do {
                    randomNum = Math.floor(Math.random() * 9) + 1;
                } while (litNumbers.includes(randomNum));

                setLitNumbers((prevLitNumbers) => [...prevLitNumbers, randomNum]);

                // Diminuer la durée de l'intervalle à chaque nouvel allumage
                setIntervalDuration((prevIntervalDuration) =>
                    Math.max(200, prevIntervalDuration - 50)
                );
            }, intervalDuration);

            return () => clearInterval(interval);
        }
    }, [gameStarted, litNumbers, intervalDuration]);

    const handleCellClick = (number) => {
        if (!gameStarted) {
            // La partie est terminée, mettez à jour le leaderboard
            updateLeaderboard();
            return;
        }

        if (litNumbers[0] === number) {
            setLitNumbers((prevLitNumbers) =>
                prevLitNumbers.filter((num) => num !== number)
            );
            setScore((prevScore) => prevScore + 1);
        } else {
            alert('Perdu ! Votre score : ' + score);
            saveScore();
            setLitNumbers([]);
            setGameStarted(false);
            setScore(0);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key;
            const number = parseInt(key);

            if (number >= 1 && number <= 9 && gameStarted) {
                setActiveNumber(number);
                handleCellClick(number);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [gameStarted, litNumbers]);

    const sortLeaderboard = (column) => {
        let direction = 'asc';

        if (sortColumn === column && sortDirection === 'asc') {
            direction = 'desc';
        }

        setSortColumn(column);
        setSortDirection(direction);

        const sortedLeaderboard = [...leaderboard].sort((a, b) => {
            const valueA = a[column];
            const valueB = b[column];

            if (valueA < valueB) {
                return direction === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        setLeaderboard(sortedLeaderboard);
    };

    const startGame = () => {
        setLitNumbers([]);
        setGameStarted(true);
        setScore(0);
        setIntervalDuration(1500);
    };

    useEffect(() => {
        if (litNumbers.length === 9) {
            alert('Perdu ! Votre score : ' + score);
            setLitNumbers([]);
            setGameStarted(false);
            setScore(0);
            updateLeaderboard();
        }
        console.log(intervalDuration);
    }, [litNumbers, score]);


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
                <div>
                    <div className={styles.navbar}>
                        <ul>
                            <li>
                                <Link href="/">Accueil</Link>
                            </li>
                        </ul>
                    </div>

                    <h3 className={styles.regles}> Le but du jeu est de cliquer sur les carrés qui s'allument dans l'ordre où ils s'allument.</h3>
                    <div className={styles.container}>
                        <div className={styles.gameContainer}>
                            <div className={styles.numericPad}>
                                <div className={styles.row}>
                                    <div
                                        className={`${styles.cell} ${
                                            litNumbers.includes(7) ? styles.lit : ''
                                        }`}
                                        onClick={() => handleCellClick(7)}
                                    >
                                        7
                                    </div>
                                    <div
                                        className={`${styles.cell} ${
                                            litNumbers.includes(8) ? styles.lit : ''
                                        }`}
                                        onClick={() => handleCellClick(8)}
                                    >
                                        8
                                    </div>
                                    <div
                                        className={`${styles.cell} ${
                                            litNumbers.includes(9) ? styles.lit : ''
                                        }`}
                                        onClick={() => handleCellClick(9)}
                                    >
                                        9
                                    </div>
                                </div>
                                <div className={styles.row}>
                                    <div
                                        className={`${styles.cell} ${
                                            litNumbers.includes(4) ? styles.lit : ''
                                        }`}
                                        onClick={() => handleCellClick(4)}
                                    >
                                        4
                                    </div>
                                    <div
                                        className={`${styles.cell} ${
                                            litNumbers.includes(5) ? styles.lit : ''
                                        }`}
                                        onClick={() => handleCellClick(5)}
                                    >
                                        5
                                    </div>
                                    <div
                                        className={`${styles.cell} ${
                                            litNumbers.includes(6) ? styles.lit : ''
                                        }`}
                                        onClick={() => handleCellClick(6)}
                                    >
                                        6
                                    </div>
                                </div>
                                <div className={styles.row}>
                                    <div
                                        className={`${styles.cell} ${
                                            litNumbers.includes(1) ? styles.lit : ''
                                        }`}
                                        onClick={() => handleCellClick(1)}
                                    >
                                        1
                                    </div>
                                    <div
                                        className={`${styles.cell} ${
                                            litNumbers.includes(2) ? styles.lit : ''
                                        }`}
                                        onClick={() => handleCellClick(2)}
                                    >
                                        2
                                    </div>
                                    <div
                                        className={`${styles.cell} ${
                                            litNumbers.includes(3) ? styles.lit : ''
                                        }`}
                                        onClick={() => handleCellClick(3)}
                                    >
                                        3
                                    </div>
                                </div>

                            </div>
                            {!gameStarted && (
                                RoundedButton({text: 'Commencer le jeu', onClick: startGame})
                            )}
                        </div>
                        <div className={styles.leaderboardContainer}>
                            <h2>Leaderboard</h2>
                            <div className={styles.leaderboardScroll}>
                                <table>
                                    <thead>
                                    <tr>
                                        <th onClick={() => sortLeaderboard('username')}>
                                            Utilisateur
                                            {sortColumn === 'username' && (
                                                <span>{sortDirection === 'asc' ? '' : ''}</span>
                                            )}
                                        </th>
                                        <th onClick={() => sortLeaderboard('score')}>
                                            Score
                                            {sortColumn === 'score' && (
                                                <span>{sortDirection === 'asc' ? '' : ''}</span>
                                            )}
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {leaderboard.map((entry, index) => (
                                        <tr key={index}>
                                            <td>{entry.username}</td>
                                            <td>{entry.score}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            ) : (
                <h1>Vous n'êtes pas autorisé à accéder à cette page</h1>
            )}
        </div>
    );
}
