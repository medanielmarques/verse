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
		<div className="flex flex-col gap-4">
			<div className="flex gap-2">
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Song name"
					className="flex-1 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-[var(--sea-ink)] placeholder:text-[var(--sea-ink-soft)] focus:border-[var(--lagoon-deep)] focus:outline-none"
				/>
				<button
					type="button"
					onClick={handleSearch}
					disabled={loading}
					className="rounded-lg border border-[var(--chip-line)] bg-[var(--chip-bg)] px-4 py-2 text-sm font-semibold text-[var(--sea-ink)] transition hover:bg-[var(--link-bg-hover)] disabled:opacity-50"
				>
					Search
				</button>
			</div>

			{loading && <p className="text-[var(--sea-ink-soft)]">Loading...</p>}

			{error && <p className="text-red-600">{error}</p>}

			{!loading && !error && results.length === 0 && query.trim() !== "" && (
				<p className="text-[var(--sea-ink-soft)]">No results found.</p>
			)}

			{!loading && results.length > 0 && (
				<div className="flex flex-col gap-2" role="list">
					{results.map((item) => (
						<button
							key={item.id}
							type="button"
							onClick={() => handleSelectSong(item)}
							className={`w-full cursor-pointer rounded-lg border p-3 text-left transition hover:border-[var(--lagoon-deep)] hover:bg-[var(--link-bg-hover)] ${
								selectedSong?.id === item.id
									? "border-[var(--lagoon-deep)] bg-[var(--hero-a)]"
									: "border-[var(--line)] bg-[var(--surface)]"
							}`}
						>
							<div className="font-semibold text-[var(--sea-ink)]">
								{item.trackName} – {item.artistName}
							</div>
							{item.albumName && (
								<div className="text-sm text-[var(--sea-ink-soft)]">
									{item.albumName}
								</div>
							)}
							{item.duration != null && (
								<div className="text-sm text-[var(--sea-ink-soft)]">
									{formatDuration(item.duration)}
								</div>
							)}
						</button>
					))}
				</div>
			)}

			{selectedSong && lines.length > 0 && (
				<div className="mt-4">
					<p className="island-kicker mb-3">Select verses</p>
					<div className="flex flex-col gap-2">
						{lines.map((line, index) => {
							const isSelected = selectedLines.includes(index);
							return (
								<button
									key={index}
									type="button"
									onClick={() => toggleLine(index)}
									className={`flex items-start gap-3 rounded-lg border px-3 py-2 text-left text-sm transition hover:border-[var(--lagoon-deep)] ${
										isSelected
											? "border-[var(--lagoon-deep)] bg-[var(--hero-a)]"
											: "border-[var(--line)] bg-[var(--surface)]"
									}`}
								>
									<span
										className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-[var(--line)] text-xs"
										aria-hidden
									>
										{isSelected ? "✓" : " "}
									</span>
									<span className="text-[var(--sea-ink)]">{line}</span>
								</button>
							);
						})}
					</div>
					{selectedLines.length > 0 && (
						<button
							type="button"
							onClick={() => onShowCard(true)}
							className="mt-4 rounded-lg border border-[var(--lagoon-deep)] bg-[var(--lagoon)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--lagoon-deep)]"
						>
							Generate Card
						</button>
					)}
				</div>
			)}
		</div>
	);
}
