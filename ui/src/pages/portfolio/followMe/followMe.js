import React from 'react';
import {motion} from 'framer-motion';
import styles from '@/styles/FollowMe.module.css'

const listVariants = {
    hidden: {
        x: -100,
        opacity: 0,
    },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            delay: 0.5,
            duration: 0.5,
        },
    },
};

const socialVariants = {
    hidden: {
        x: -50,
        opacity: 0,
    },
    visible: {
        x: -50,
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    },
};


const List = ({children}) => {
    return (
        <motion.ul variants={listVariants} className={styles.followMePlacement}>
            {children}
        </motion.ul>
    );
};
const GitHub = () => {

    return (
        <div className={styles.followMe}>
            <div>
                <a href="https://github.com/Riqoulouru" target="_blank" className={styles.github}><span></span></a>
            </div>
        </div>

    );
};

const Linkedin = () => {

    return (
        <div className={styles.followMe}>
            <a href="https://www.linkedin.com/in/basile-thiry-6222951aa/" target="_blank" className={styles.linkedin}><span></span></a>
        </div>

    );
};
const GitLab = () => {

    return (
        <div className={styles.followMe}>
            <a href="https://gitlab.com/Riqou" target="_blank" className={styles.gitlab}><span></span></a>
        </div>

    );
};

const SuivezMoi = () => {
    return (
        <List>
            <GitHub/>
            <Linkedin/>
            <GitLab/>
        </List>
    );
};

export default SuivezMoi;