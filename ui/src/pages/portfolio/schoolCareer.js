import styles from "@/styles/SchoolCareer.module.css";
import {motion as m} from 'framer-motion'
import LeftArrow from "@/pages/portfolio/Component/LeftArrow/LeftArrow";
import RightArrow from "@/pages/portfolio/Component/RightArrow/RightArrow";
import Card from "@/pages/Component/SchoolCard/Card";
import ShowBurger from "@/pages/portfolio/burger/burger";
import {useRouter} from "next/router";
import Link from "next/link";

export default function SchoolCareer() {
    const router = useRouter();
    const direction = router.query.direction;
    return (
        <m.main
            className={styles.root}
            initial={ direction === "right" ? {x: "-100%"} : {x: "100%"}}
            animate={{x: "0%"}}
            transition={{duration: 0.5, ease: "easeInOut"}}
        >
            <ShowBurger name="School carrer"></ShowBurger>
            <div className={styles.spacing}>
                <Link href={"/"} className={styles.roundedButton}>
                    Home
                </Link>
            </div>
            <div className={styles.centerText}>
                <h1>School Career</h1>
                <p>Below, you will find information about my educational background and the knowledge that I have
                    acquired.</p>
            </div>

            <div className={styles.divGrid}>
                <ul className={styles.gridContainer}>
                    <Card source="https://basilethiry.fr/back/images/getImage/Insa.png" alt="test" title="COMPUTER ENGINEERING SCHOOL INSA" label={['Computer programming (Java, C, SQL, HTML/CSS, JavaScript, Prolog, Python, Flutter)', 'Unix Commands, design Patterns, agile scrum method','Artificial Intelligence, Network and Systems Programming']} link="https://www.insa-hautsdefrance.fr/"/>
                    <Card source="https://basilethiry.fr/back/images/getImage/iutmaubeuge.png" alt="test" title="UNIVERSITY TECHNOLOGICAL IN COMPUTER SCIENCE" label={['Application integration and deployment', 'Realisation of applications : design, development, validation','Database administration, project management']} link="https://formations.uphf.fr/fr/formations/bachelor-universitaire-de-technologie-but/but-informatique-L06G2DBP.html"/>
                    <Card source="https://basilethiry.fr/back/images/getImage/jesseDeForest.jpg" alt="test" title="SCIENTIFIC BACCALAUREATE" label={['Introduction to computers and programming', 'Science subjects']} link="https://jesse-de-forest-avesnes-sur-helpe.enthdf.fr/"/>
                </ul>
            </div>

            <LeftArrow text="Portfolio" link="/portfolio/portfolio" direction="right"/>
            <RightArrow text="Contact" link="/portfolio/contact" direction="left"/>
        </m.main>
    )

}