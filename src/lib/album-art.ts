export async function fetchAlbumArt(
	artistName: string,
	albumName?: string,
	trackName?: string,
): Promise<string | null> {
	const query = [artistName, albumName, trackName].filter(Boolean).join(" ");
	if (!query.trim()) return null;

	try {
		const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=1`;
		const res = await fetch(url);
		if (!res.ok) return null;

		const data = (await res.json()) as {
			results?: { artworkUrl100?: string }[];
		};
		const artwork = data.results?.[0]?.artworkUrl100;
		if (!artwork) return null;

		return artwork.replace("100x100", "512x512");
	} catch {
		return null;
	}
}
