import {Squash as Hamburger} from 'hamburger-react'
import {useEffect, useState} from "react";
import styles from "@/styles/Burger.module.css"
import Link from "next/link";


function ShowBurger(props) {
    const [burgerVisible, setBburgerVisible] = useState(false);

    useEffect(() => {

    }, [burgerVisible]);

    function HamburgerCLicked() {
        setBburgerVisible(!burgerVisible);
    }

    function getStyle() {
        return burgerVisible ? styles.visible : styles.invisible;
    }


    const listClasses = [styles.navBox, getStyle()].join(" ")

    return (
        <div>
            <nav className={listClasses}>
                <Link href="/portfolio/about"><span className={props.name === "About" ? styles.selected : ""}>About</span></Link>
                <Link href="/portfolio/portfolio"><span className={props.name === "Portfolio" ? styles.selected : ""}>Portfolio</span></Link>
                <Link href="/portfolio/schoolCareer"><span className={props.name === "School carrer" ? styles.selected : ""}>School career</span></Link>
                <Link href="/portfolio/contact"><span className={props.name === "Contact" ? styles.selected : ""}>Contact</span></Link>
            </nav>
            <div className={styles.burger}>
                <Hamburger onToggle={HamburgerCLicked}></Hamburger>
            </div>

        </div>
    )
}

export default ShowBurger;