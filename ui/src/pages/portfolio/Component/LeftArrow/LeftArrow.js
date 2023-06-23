import Link from "next/link";
import styles from "@/styles/LeftArrow.module.scss";

export default function leftArrow(props) {

    const link = props.link;
    const text = props.text;
    const direction = props.direction;

    return (
        <Link href={{ pathname:link || "#", query: {direction:direction || "" } }} >
            <div className={styles.arrowContainer}>
                <p className={styles.arrow}></p>
                <p className={styles.leftText}>{text}</p>
            </div>
        </Link>

    );
}