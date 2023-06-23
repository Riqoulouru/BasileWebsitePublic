import '../styles/globals.css'
import styles from "@/styles/Default.module.css";
import {AnimatePresence} from "framer-motion";
import {useRouter} from 'next/router'
import Modal from "react-modal";

export default function App({Component, pageProps}) {
    Modal.setAppElement('#root');

    return (
        <AnimatePresence initial={false}>
            <div id="root" className={styles.background}>
                <Component key={useRouter().pathname} {...pageProps} />
            </div>
        </AnimatePresence>
    );
}
