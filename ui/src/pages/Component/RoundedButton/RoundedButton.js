import styles from "@/styles/RoundedButton.module.css";
import {Button} from "@mui/material";

function Label(props) {
    let list = [];
    const lenght = props.label.length;

    for (let i = 0; i < lenght; i++) {
        list.push(<li key={i}>{props.label[i]}</li>)
    }
    return list;
}

export default function RoundedButton(props) {
    return (
        <button onClick={props.onClick} className={styles.roundedButton}>{props.text}</button>
    );
}