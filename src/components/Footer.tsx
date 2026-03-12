export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="border-t-2 border-[#3F3F46] bg-[#DFE104] px-4 py-12">
			<div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
				<p className="m-0 text-sm font-bold uppercase tracking-tighter text-[#000000] md:text-base">
					© {year} Verse. Lyrics to image.
				</p>
			</div>
		</footer>
	);
}
