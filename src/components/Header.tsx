import { Link } from "@tanstack/react-router";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 border-b-2 border-[#3F3F46] bg-[#09090B] px-4">
			<nav className="page-wrap flex items-center justify-between py-4">
				<Link
					to="/"
					className="text-sm font-bold uppercase tracking-tighter text-[#FAFAFA] no-underline transition-colors duration-300 hover:text-[#DFE104] md:text-base focus:outline-none focus:ring-2 focus:ring-[#DFE104] focus:ring-offset-2 focus:ring-offset-[#09090B]"
				>
					Verse
				</Link>
			</nav>
		</header>
	);
}
