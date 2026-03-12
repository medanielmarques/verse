import { toPng } from "html-to-image";
import { useRef } from "react";

interface CardPreviewProps {
	song: {
		trackName: string;
		artistName: string;
		albumName?: string;
	};
	selectedLines: number[];
	allLines: string[];
}

export function CardPreview({
	song,
	selectedLines,
	allLines,
}: CardPreviewProps) {
	const cardRef = useRef<HTMLDivElement>(null);

	const selectedTexts = selectedLines.map((i) => allLines[i]).filter(Boolean);

	async function handleDownload() {
		if (!cardRef.current) return;
		try {
			const dataUrl = await toPng(cardRef.current, {
				pixelRatio: 2,
				backgroundColor: "#ffffff",
			});
			const link = document.createElement("a");
			link.href = dataUrl;
			link.download = "lyrics-card.png";
			link.click();
		} catch (err) {
			console.error("Download failed:", err);
		}
	}

	if (selectedTexts.length === 0) return null;

	return (
		<div className="flex flex-col items-center gap-6">
			<div
				ref={cardRef}
				className="w-full max-w-md rounded-2xl border-2 border-[var(--line)] bg-white p-8 shadow-lg"
				style={{ color: "#173a40" }}
			>
				<div className="mb-6 space-y-3 text-center">
					{selectedTexts.map((line, i) => (
						<p key={`verse-${i}`} className="m-0 text-lg leading-relaxed">
							{line}
						</p>
					))}
				</div>
				<div className="border-t border-[var(--line)] pt-4 text-center">
					<p className="m-0 text-sm font-medium opacity-80">
						— {song.artistName}
					</p>
					<p className="m-0 text-sm opacity-70">{song.trackName}</p>
					{song.albumName && (
						<p className="m-0 text-xs opacity-60">{song.albumName}</p>
					)}
				</div>
			</div>
			<button
				type="button"
				onClick={handleDownload}
				className="rounded-lg border border-[var(--lagoon-deep)] bg-[var(--lagoon)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--lagoon-deep)]"
			>
				Download Image
			</button>
		</div>
	);
}
