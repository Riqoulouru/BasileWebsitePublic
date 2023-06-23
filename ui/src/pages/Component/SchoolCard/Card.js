import styles from "@/styles/Card.module.css";

function Label(props) {
    let list = [];
    const lenght = props.label.length;

    for (let i = 0; i < lenght; i++) {
        list.push(<li key={i}>{props.label[i]}</li>)
    }
    return list;
}

export default function Card(props) {
    return (

        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.imgBox}>
                    <img src={props.source} alt={props.alt}/>
                </div>
                <h1 className={styles.title}>{props.title}</h1>
            </div>

            <div className={styles.content}>
                <ul>
                    <Label label={props.label || [""]}></Label>
                </ul>
                <a className={styles.btnLink} href={props.link}>Read More...</a>
            </div>
        </div>

    );
}