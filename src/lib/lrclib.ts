const LRCLIB_BASE = "https://lrclib.net/api";

export interface LrclibSong {
	id: number;
	trackName: string;
	artistName: string;
	albumName?: string;
	duration?: number;
	plainLyrics?: string;
	syncedLyrics?: string;
}

export async function searchSongs(query: string): Promise<LrclibSong[]> {
	const url = `${LRCLIB_BASE}/search?q=${encodeURIComponent(query)}`;
	const response = await fetch(url);
	if (!response.ok) throw new Error(`Search failed: ${response.status}`);
	const data = await response.json();
	return Array.isArray(data) ? (data as LrclibSong[]) : [];
}

export async function getSongById(id: number): Promise<LrclibSong | null> {
	const url = `${LRCLIB_BASE}/get/${id}`;
	const response = await fetch(url);
	if (!response.ok) return null;
	const data = await response.json();
	return data as LrclibSong;
}
