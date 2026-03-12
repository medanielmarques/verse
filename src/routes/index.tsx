import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CardPreview } from "#/components/CardPreview";
import type { LrclibSong } from "#/components/LyricsSearch";
import { LyricsSearch } from "#/components/LyricsSearch";

export const Route = createFileRoute("/")({ component: App });

function parseLyrics(song: LrclibSong | null) {
	if (!song) return [];
	const raw = song.plainLyrics || song.syncedLyrics || "";
	return raw
		.split("\n")
		.filter(Boolean)
		.map((line) => line.replace(/^\[\d+:\d+\.\d+\]\s*/, "").trim());
}

function App() {
	const [selectedSong, setSelectedSong] = useState<LrclibSong | null>(null);
	const [selectedLines, setSelectedLines] = useState<number[]>([]);
	const [showCard, setShowCard] = useState(false);

	function handleSelectSong(song: typeof selectedSong) {
		setSelectedSong(song);
		setSelectedLines([]);
		setShowCard(false);
	}

	const allLines = selectedSong ? parseLyrics(selectedSong) : [];

	const showFloatingButton =
		selectedSong && selectedLines.length > 0 && !showCard;

	return (
		<main className="min-h-screen">
			{/* Lyrics / Search - hidden when card is shown */}
			{!showCard && (
				<section className="page-wrap px-4 py-32">
					<div className="mx-auto max-w-[95vw]">
						<p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#A1A1AA] md:text-sm lg:text-lg">
							Lyrics Search
						</p>
						<div className="border-2 border-[#3F3F46] bg-[#09090B] p-8 md:p-12">
							<LyricsSearch
								selectedSong={selectedSong}
								onSelectSong={handleSelectSong}
								selectedLines={selectedLines}
								onSelectLines={setSelectedLines}
							/>
						</div>
					</div>
				</section>
			)}

			{/* Floating Generate Card button */}
			{showFloatingButton && (
				<div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-6">
					<button
						type="button"
						onClick={() => setShowCard(true)}
						className="h-14 cursor-pointer bg-[#DFE104] px-8 font-bold uppercase tracking-tighter text-[#000000] transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#DFE104] focus:ring-offset-2 focus:ring-offset-[#09090B] shadow-lg"
					>
						Generate Card
					</button>
				</div>
			)}

			{/* Card view - only shown when Generate Card was clicked */}
			{showCard && selectedSong && selectedLines.length > 0 && (
				<section className="page-wrap flex min-h-screen flex-col items-center justify-center px-4 py-32">
					<div className="group mx-auto max-w-[95vw]">
						<div className="border-2 border-[#3F3F46] bg-[#09090B] p-8 transition-colors duration-300 hover:border-[#DFE104] hover:bg-[#DFE104] md:p-12">
							<CardPreview
								song={selectedSong}
								selectedLines={selectedLines}
								allLines={allLines}
							/>
						</div>
						<div className="mt-8 flex flex-wrap justify-center gap-4">
							<button
								type="button"
								onClick={() => {
									setShowCard(false);
								}}
								className="h-14 cursor-pointer border-2 border-[#3F3F46] bg-transparent px-8 font-bold uppercase tracking-tighter text-[#FAFAFA] transition-all duration-300 hover:border-[#DFE104] hover:bg-[#DFE104] hover:text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#DFE104] focus:ring-offset-2 focus:ring-offset-[#09090B]"
							>
								Change lyrics
							</button>
							<button
								type="button"
								onClick={() => handleSelectSong(null)}
								className="h-14 cursor-pointer border-2 border-[#3F3F46] bg-transparent px-8 font-bold uppercase tracking-tighter text-[#FAFAFA] transition-all duration-300 hover:border-[#DFE104] hover:bg-[#DFE104] hover:text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#DFE104] focus:ring-offset-2 focus:ring-offset-[#09090B]"
							>
								Choose another song
							</button>
						</div>
					</div>
				</section>
			)}
		</main>
	);
}
