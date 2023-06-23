import styles from "@/styles/Portfolio.module.css";
import Link from "next/link";

function Label(props) {
    let list = [];
    const lenght = props.label.length;

    for (let i = 0; i < lenght; i++) {
        list.push(<li key={i}>{props.label[i]}</li>)
    }
    list.push(<li key={props.label.length}>More...</li>);
    return list;
}

export default function Project(props) {
    return (
        <Link href={props.link || "#"} target="_blank">
            <div className={styles.gridItem}>
                <div className={styles.bar}>
                    <h2>{props.title}</h2>
                </div>
                <div className={styles.content}>
                    <img src={props.imageSource} alt={props.alt} className={styles.projectImage}/>
                    <div className={styles.overlay}>
                        <div className={styles.listDiv}>
                            <ul>
                                <Label label={props.label || [""]}></Label>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </Link>

    );
}