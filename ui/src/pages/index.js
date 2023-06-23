import React, { useEffect, useState } from 'react';
import styles from '@/styles/Home.module.scss';
import Link from 'next/link';
import { checkLoginStatus } from '@/utils/auth.js';

const HomePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRoles, setUserRoles] = useState([""]);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const fetchLoginStatus = async () => {
            const loggedIn = await checkLoginStatus();
            console.log("login status: " + loggedIn);
            setIsLoggedIn(loggedIn);
            const roles = localStorage.getItem('userRole');

            if (roles != null && loggedIn) {
                setUserRoles(localStorage.getItem('userRole'));
            }
        };

        fetchLoginStatus().then(() => {
            console.log("login status fetched");
        });
    }, []);

    function handleLogout() {
        console.log("logout");
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        setUserRoles([""]);
    }

    function handleMenuClick() {
        setShowMenu(!showMenu);
    }

    return (
        <div className={styles.container}>
                <nav className={`${styles.navBar} ${showMenu ? styles.responsive : ''}`}>
                <button className={`${styles.menuButton} ${styles.roundedButton} `} onClick={handleMenuClick}>
                    Menu
                </button>
                <ul className={`${styles.navLinks} ${showMenu ? styles.show : ''}`}>
                    {userRoles.includes("PlexUser") && (
                        <li>
                            <Link href="/User/demandePlex">Demander un film</Link>
                        </li>
                    )}
                    {userRoles.includes("Admin") && (
                        <li>
                            <Link href="/Admin/adminHub">Admin Hub</Link>
                        </li>
                    )}
                    {userRoles.includes("FolleHistoire") && (
                        <li>
                            <Link href="/laFolleHistoire">La folle histoire</Link>
                        </li>
                    )}
                    {userRoles.includes("User") && (
                        <li>
                            <Link href="/User/numericPadGame">Numeric Pad Game</Link>
                        </li>
                    )}
                </ul>


            </nav>
            <div className={styles.buttonsContainer}>
                {isLoggedIn ? (
                    <button onClick={handleLogout} className={styles.roundedButton}>
                        Logout
                    </button>
                ) : (
                    <div>
                        <Link href="/login" className={styles.roundedButton}>
                            Sign In
                        </Link>
                        <Link href="/register" className={styles.roundedButton}>
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
            <div className={styles.contentContainer}>
                <h1 className={styles.welcomeMessage}>Welcome to the Site!</h1>
                <p className={styles.exploreMessage}>
                    Check out my portfolio <Link href="/portfolio/about">here</Link>.
                </p>
            </div>
        </div>
    );
};

export default HomePage;
