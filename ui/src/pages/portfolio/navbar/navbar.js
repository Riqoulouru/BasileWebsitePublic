import Link from "next/link";

export default function Navbar(){
    return(
        <nav>
            <ul>
                <Link href={"portfolio/about/about"}>
                    <li>about</li>
                </Link>
                <Link href={"portfolio/test"}>
                    <li>test</li>
                </Link>
            </ul>
        </nav>
    );
}