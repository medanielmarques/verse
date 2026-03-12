import { useState } from "react";

const LRCLIB_SEARCH_URL = "https://lrclib.net/api/search";

export interface LrclibSong {
	id: number;
	trackName: string;
	artistName: string;
	albumName?: string;
	duration?: number;
	plainLyrics?: string;
	syncedLyrics?: string;
}

interface LyricsSearchProps {
	selectedSong: LrclibSong | null;
	onSelectSong: (song: LrclibSong | null) => void;
	selectedLines: number[];
	onSelectLines: React.Dispatch<React.SetStateAction<number[]>>;
	onShowCard: (show: boolean) => void;
}

function formatDuration(seconds: number | null | undefined): string | null {
	if (seconds == null || seconds === undefined) return null;
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function parseLyrics(song: LrclibSong | null): string[] {
	if (!song) return [];
	const raw = song.plainLyrics || song.syncedLyrics || "";
	return raw
		.split("\n")
		.filter(Boolean)
		.map((line) => line.replace(/^\[\d+:\d+\.\d+\]\s*/, "").trim());
}

export function LyricsSearch({
	selectedSong,
	onSelectSong,
	selectedLines,
	onSelectLines,
	onShowCard,
}: LyricsSearchProps) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<LrclibSong[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSearch() {
		const trimmed = query.trim();
		if (!trimmed) return;

		setLoading(true);
		setError(null);
		setResults([]);
		onSelectSong(null);

		try {
			const url = `${LRCLIB_SEARCH_URL}?q=${encodeURIComponent(trimmed)}`;
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`Search failed: ${response.status}`);
			}

			const data = await response.json();
			setResults(Array.isArray(data) ? data : []);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			handleSearch();
		}
	}

	function handleSelectSong(item: LrclibSong) {
		onSelectSong(item);
		onSelectLines([]);
	}

	function toggleLine(index: number) {
		onSelectLines((prev) =>
			prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
		);
	}

	const lines = selectedSong ? parseLyrics(selectedSong) : [];

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="SONG NAME"
					className="h-24 flex-1 border-b-2 border-[#3F3F46] bg-transparent px-0 text-2xl font-bold uppercase tracking-tighter text-[#FAFAFA] placeholder:text-[#27272A] focus:border-[#DFE104] focus:outline-none md:text-4xl"
				/>
				<button
					type="button"
					onClick={handleSearch}
					disabled={loading}
					className="h-14 shrink-0 border-2 border-[#3F3F46] bg-transparent px-8 font-bold uppercase tracking-tighter text-[#FAFAFA] transition-all duration-300 hover:scale-105 hover:border-[#FAFAFA] hover:bg-[#FAFAFA] hover:text-[#09090B] active:scale-95 disabled:pointer-events-none disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#DFE104] focus:ring-offset-2 focus:ring-offset-[#09090B]"
				>
					Search
				</button>
			</div>

			{loading && (
				<p className="text-lg text-[#A1A1AA] md:text-xl lg:text-2xl">
					Loading...
				</p>
			)}

			{error && (
				<p className="text-lg text-[#A1A1AA] md:text-xl lg:text-2xl">{error}</p>
			)}

			{!loading && !error && results.length === 0 && query.trim() !== "" && (
				<p className="text-lg text-[#A1A1AA] md:text-xl lg:text-2xl">
					No results found.
				</p>
			)}

			{!loading && results.length > 0 && (
				<div className="flex flex-col gap-2" role="list">
					{results.map((item) => (
						<button
							key={item.id}
							type="button"
							onClick={() => handleSelectSong(item)}
							className={`group w-full cursor-pointer border-2 p-6 text-left transition-colors duration-300 ${
								selectedSong?.id === item.id
									? "border-[#DFE104] bg-[#DFE104] text-[#000000]"
									: "border-[#3F3F46] bg-transparent text-[#FAFAFA] hover:border-[#DFE104] hover:bg-[#DFE104] hover:text-[#000000]"
							}`}
						>
							<div className="text-xl font-bold text-inherit md:text-2xl lg:text-3xl">
								{item.trackName} – {item.artistName}
							</div>
							{item.albumName && (
								<div className="mt-1 text-base text-inherit opacity-80 md:text-lg lg:text-xl">
									{item.albumName}
								</div>
							)}
							{item.duration != null && (
								<div className="mt-1 text-sm text-inherit opacity-70 md:text-base">
									{formatDuration(item.duration)}
								</div>
							)}
						</button>
					))}
				</div>
			)}

			{selectedSong && lines.length > 0 && (
				<div className="mt-4">
					<p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#A1A1AA] md:text-sm lg:text-lg">
						Select verses
					</p>
					<div className="flex flex-col gap-2">
						{lines.map((line, index) => {
							const isSelected = selectedLines.includes(index);
							return (
								<button
									key={index}
									type="button"
									onClick={() => toggleLine(index)}
									className={`flex items-start gap-4 border-2 px-4 py-3 text-left text-base transition-colors duration-300 md:text-lg lg:text-xl ${
										isSelected
											? "border-[#DFE104] bg-[#DFE104] text-[#000000]"
											: "border-[#3F3F46] bg-transparent text-[#FAFAFA] hover:border-[#DFE104] hover:bg-[#DFE104] hover:text-[#000000]"
									}`}
								>
									<span
										className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center border-2 border-current text-xs font-bold"
										aria-hidden
									>
										{isSelected ? "✓" : " "}
									</span>
									<span className="text-inherit">{line}</span>
								</button>
							);
						})}
					</div>
					{selectedLines.length > 0 && (
						<button
							type="button"
							onClick={() => onShowCard(true)}
							className="mt-8 h-14 bg-[#DFE104] px-8 font-bold uppercase tracking-tighter text-[#000000] transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#DFE104] focus:ring-offset-2 focus:ring-offset-[#09090B]"
						>
							Generate Card
						</button>
					)}
				</div>
			)}
		</div>
	);
}
