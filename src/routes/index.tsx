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
		<main className="page-wrap px-4 pb-8 pt-14">
			<section className="island-shell rounded-2xl p-6">
				<p className="island-kicker mb-2">Lyrics Search</p>
				<LyricsSearch
					selectedSong={selectedSong}
					onSelectSong={handleSelectSong}
					selectedLines={selectedLines}
					onSelectLines={setSelectedLines}
					onShowCard={setShowCard}
				/>
			</section>

			{showCard && selectedSong && selectedLines.length > 0 && (
				<section className="island-shell mt-8 rounded-2xl p-6">
					<CardPreview
						song={selectedSong}
						selectedLines={selectedLines}
						allLines={allLines}
					/>
				</section>
			)}
		</main>
	);
}
