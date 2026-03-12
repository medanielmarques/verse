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

	return (
		<main className="min-h-screen">
			{/* Main content */}
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
							onShowCard={setShowCard}
						/>
					</div>
				</div>
			</section>

			{showCard && selectedSong && selectedLines.length > 0 && (
				<section className="page-wrap border-t-2 border-[#3F3F46] px-4 py-32">
					<div className="group mx-auto max-w-[95vw]">
						<div className="border-2 border-[#3F3F46] bg-[#09090B] p-8 transition-colors duration-300 hover:border-[#DFE104] hover:bg-[#DFE104] md:p-12">
							<CardPreview
								song={selectedSong}
								selectedLines={selectedLines}
								allLines={allLines}
							/>
						</div>
					</div>
				</section>
			)}
		</main>
	);
}
