import styles from "@/styles/RightArrow.module.scss"
import Link from "next/link";

export default function rightArrow(props) {

    const link = props.link;
    const text = props.text;
    const direction = props.direction;


    return (
        <Link href={{ pathname:link || "#", query: {direction:direction || "" } }} >
            <div className={styles.arrowContainer}>
                <p className={styles.arrow}></p>
                <p className={styles.rightText}>{text}</p>
            </div>
        </Link>

    );
}