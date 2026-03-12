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

	const selectedTexts = selectedLines
		.map((idx) => ({ idx, line: allLines[idx] }))
		.filter((x) => x.line);

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
		<div className="flex flex-col items-center gap-8">
			<div
				ref={cardRef}
				className="w-full max-w-md border-2 border-[#3F3F46] bg-white p-8 md:p-12"
				style={{ color: "#09090B" }}
			>
				<div className="mb-8 space-y-4 text-center">
					{selectedTexts.map(({ idx, line }) => (
						<p
							key={`verse-${idx}`}
							className="m-0 text-xl font-medium leading-tight text-[#09090B] md:text-2xl lg:text-3xl"
						>
							{line}
						</p>
					))}
				</div>
				<div className="border-t-2 border-[#3F3F46] pt-6 text-center">
					<p className="m-0 text-sm font-bold uppercase tracking-tighter text-[#09090B] opacity-80 md:text-base">
						— {song.artistName}
					</p>
					<p className="m-0 text-sm opacity-70 md:text-base">
						{song.trackName}
					</p>
					{song.albumName && (
						<p className="m-0 text-xs opacity-60 md:text-sm">
							{song.albumName}
						</p>
					)}
				</div>
			</div>
			<button
				type="button"
				onClick={handleDownload}
				className="h-14 cursor-pointer border-2 border-[#3F3F46] bg-transparent px-8 font-bold uppercase tracking-tighter text-[#FAFAFA] transition-all duration-300 hover:scale-105 hover:border-[#FAFAFA] hover:bg-[#FAFAFA] hover:text-[#09090B] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#DFE104] focus:ring-offset-2 focus:ring-offset-[#09090B] group-hover:text-[#000000] group-hover:border-[#000000]"
			>
				Download Image
			</button>
		</div>
	);
}
