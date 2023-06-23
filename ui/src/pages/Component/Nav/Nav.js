import Link from "next/link";

export default function Nav() {
    return (
        <nav>
            <ul>
                <Link href="/">
                    <li>Home</li>
                </Link>
                <Link href="/portfolio/about">
                    <li>about</li>
                </Link>
                <Link href="/portfolio/portfolio">
                    <li>portfolio</li>
                </Link>
            </ul>
        </nav>
    )
}