import { useState } from "react";

const LRCLIB_SEARCH_URL = "https://lrclib.net/api/search";

function formatDuration(seconds) {
	if (seconds == null || seconds === undefined) return null;
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function LyricsSearch() {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	async function handleSearch() {
		const trimmed = query.trim();
		if (!trimmed) return;

		setLoading(true);
		setError(null);
		setResults([]);

		try {
			const url = `${LRCLIB_SEARCH_URL}?q=${encodeURIComponent(trimmed)}`;
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`Search failed: ${response.status}`);
			}

			const data = await response.json();
			setResults(Array.isArray(data) ? data : []);
		} catch (err) {
			setError(err.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	function handleKeyDown(e) {
		if (e.key === "Enter") {
			handleSearch();
		}
	}

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
			<div style={{ display: "flex", gap: "0.5rem" }}>
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Song name"
					style={{ flex: 1, padding: "0.5rem" }}
				/>
				<button
					type="button"
					onClick={handleSearch}
					disabled={loading}
					style={{ padding: "0.5rem 1rem" }}
				>
					Search
				</button>
			</div>

			{loading && <p>Loading...</p>}

			{error && <p style={{ color: "red" }}>{error}</p>}

			{!loading && !error && results.length === 0 && query.trim() !== "" && (
				<p>No results found.</p>
			)}

			{!loading && results.length > 0 && (
				<ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
					{results.map((item) => (
						<li
							key={item.id}
							style={{
								padding: "0.75rem",
								marginBottom: "0.5rem",
								border: "1px solid #ddd",
								borderRadius: "4px",
							}}
						>
							<div style={{ fontWeight: "bold" }}>
								{item.trackName} – {item.artistName}
							</div>
							{item.albumName && (
								<div style={{ fontSize: "0.9em", color: "#666" }}>
									{item.albumName}
								</div>
							)}
							{item.duration != null && (
								<div style={{ fontSize: "0.9em", color: "#666" }}>
									{formatDuration(item.duration)}
								</div>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
