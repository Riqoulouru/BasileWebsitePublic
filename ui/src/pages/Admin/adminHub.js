// Importation des modules nécessaires
import Link from 'next/link';

// Importation du fichier SCSS
import styles from '@/styles/AdminHub.module.scss';
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {checkLoginStatus} from "@/utils/auth";

// Définition des données pour les mosaïques
const mosaicData = [
    {
        id: 1,
        title: 'Ajout d\'un role à un utilisateur',
        link: '/Admin/addRole'
    },
    {
        id: 2,
        title: 'Enlever un role à un utilisateur',
        link: '/Admin/removeRole'
    },
    {
        id: 3,
        title: 'Voir les demandes',
        link: '/Admin/demandes'
    },
    {
        id: 4,
        title: 'Mosaïque 2',
        link: '/page2'
    },
    {
        id: 5,
        title: 'Mosaïque 2',
        link: '/page2'
    },
    {
        id: 6,
        title: 'Mosaïque 2',
        link: '/page2'
    },
    {
        id: 7,
        title: 'Mosaïque 2',
        link: '/page2'
    },
    {
        id: 8,
        title: 'Mosaïque 2',
        link: '/page2'
    },
    // Ajoutez plus de données pour les autres mosaïques...
];


export default function AdminHub() {

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
            {
                loadAuthorized ? (
                    <div>
                        <div className={styles.navbar}>
                            <ul>
                                <li><Link href="/">Accueil</Link></li>
                            </ul>
                        </div>

                        <div className={styles.container}>
                            <div className={styles.rectangle}>
                                <div className={styles.grid}>
                                    {mosaicData.map(mosaic => (
                                        <Link key={mosaic.id} href={mosaic.link} className={styles.gridItem}>
                                            <div className={styles.mosaicContent}>
                                                <h3>{mosaic.title}</h3>
                                            </div>

                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h1>Vous n'êtes pas autorisé à accéder à cette page</h1>
                    </div>
                )
            }
        </div>
    );
}