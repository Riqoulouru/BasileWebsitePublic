import {useState, useEffect} from 'react'
import {motion as m} from 'framer-motion';
import FollowMe from "./followMe/followMe";
import styles from '@/styles/About.module.css'
import ShowBurger from "./burger/burger";
import RightArrow from "./Component/RightArrow/RightArrow";
import {useRouter} from "next/router";
import Link from "next/link";


function Underscore() {
    return (
        <m.b
            initial={{opacity: 1}}
            animate={{opacity: [0, 1, 0]}}
            exit={{opacity: 0}}
            transition={{duration: 0.5, repeat: Infinity}}
        >_</m.b>
    )
}


function TextAnimation() {
    const [textSentence1, setTextSentence1] = useState("");
    const [textIndexSentence1, setTextIndexSentence1] = useState(0);
    const [textSentence2, setTextSentence2] = useState("");
    const [textIndexSentence2, setTextIndexSentence2] = useState(0);
    const [textlinkSentence3, setTextlinkSentence3] = useState("");
    const [textIndexlinkSentence3, setTextIndexlinkSentence3] = useState(0);
    const [textSentence3, setTextSentence3] = useState("");
    const [textIndexSentence3, setTextIndexSentence3] = useState(0);
    const [textSentence4, setTextSentence4] = useState("");
    const [textIndexSentence4, setTextIndexSentence4] = useState(0);

    const [sentence1] = useState("Hello, my name is Basile Thiry.");
    const [sentence2] = useState("Computer science engineer.");
    const [sentence3] = useState("Student at ");
    const [linkSentence3] = useState("Insa Hauts-de-France.");
    const [sentence4] = useState("Welcome to my website!");

    const [elementKey, setElementKey] = useState(1);


    useEffect(() => {
        if (textIndexSentence1 !== sentence1.length) {
            setTimeout(() => {
                setTextSentence1(textSentence1 + sentence1[textIndexSentence1]);
                setTextIndexSentence1(textIndexSentence1 + 1);
            }, 20);
        } else {
            elementKey === 1 && setElementKey(2);
            if (textIndexSentence2 !== sentence2.length) {
                setTimeout(() => {
                    setTextSentence2(textSentence2 + sentence2[textIndexSentence2]);
                    setTextIndexSentence2(textIndexSentence2 + 1);
                }, 20);
            } else {
                elementKey === 2 && setElementKey(3);
                if (textIndexSentence3 !== sentence3.length) {
                    setTimeout(() => {
                        setTextSentence3(textSentence3 + sentence3[textIndexSentence3]);
                        setTextIndexSentence3(textIndexSentence3 + 1);
                    }, 20);
                } else {
                    if (textIndexlinkSentence3 !== linkSentence3.length) {
                        setTimeout(() => {
                            setTextlinkSentence3(textlinkSentence3 + linkSentence3[textIndexlinkSentence3]);
                            setTextIndexlinkSentence3(textIndexlinkSentence3 + 1);
                        }, 20);
                    } else {
                        elementKey === 3 && setElementKey(4);
                        if (textIndexSentence4 !== sentence4.length) {
                            setTimeout(() => {
                                setTextSentence4(textSentence4 + sentence4[textIndexSentence4]);
                                setTextIndexSentence4(textIndexSentence4 + 1);
                            }, 20);
                        }
                    }
                }
            }
        }
    }, [textSentence1, textSentence2, textSentence3, textSentence4, textlinkSentence3]);


    return (
        <div>
            <Link href={"/"} className={styles.roundedButton}>
                Home
            </Link>


            <div className={styles.textBlock}>

                <p className={styles.whiteColor}>{textSentence1}{elementKey === 1 && <Underscore/>}</p>
                <p>{textSentence2}{elementKey === 2 && <Underscore/>}</p>
                <p>{textSentence3}<a
                    href="https://www.insa-hautsdefrance.fr/">{textlinkSentence3}</a>{elementKey === 3 &&
                    <Underscore/>}</p>
                <p>{textSentence4}{elementKey === 4 && <Underscore/>}</p>
            </div>
        </div>
    )
}

export function HomePage() {

    return (
        <m.main
            className={styles.root}
            initial={{x: "-100%"}}
            animate={{x: "0%"}}
            transition={{duration: 0.5, ease: "easeInOut"}}
        >
            <ShowBurger name="About"></ShowBurger>
            <FollowMe/>
            <div className={styles.position}>
                <m.img
                    src="https://basilethiry.fr/back/images/getImage/Basile.jpg"
                    alt="Moi"
                    className={styles.imgBasile}
                    animate={{borderRadius: ['61% 39% 67% 33% / 46% 66% 34% 54%', '41% 59% 40% 60% / 46% 66% 34% 54%', '34% 67% 27% 40% / 40% 66% 34% 54%', '61% 39% 67% 33% / 46% 66% 34% 54%']}}
                    transition={{ease: "linear", duration: 3, repeat: Infinity}}
                />
                <br/>
                <TextAnimation/>
            </div>
            <RightArrow text='Portfolio' link='/portfolio/portfolio' direction="left"/>
        </m.main>
    );

}

export default HomePage;