import { toPng } from "html-to-image";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fetchAlbumArt } from "#/lib/album-art";
import type { CardFont, CardTemplate } from "#/lib/card-templates";
import {
	EXPORT_PRESETS,
	type ExportPreset,
	PHONE_PRESETS,
} from "#/lib/export-presets";

interface CardPreviewProps {
	song: {
		trackName: string;
		artistName: string;
		albumName?: string;
	};
	selectedLines: number[];
	allLines: string[];
	includeArtist?: boolean;
	includeSong?: boolean;
	includeAlbum?: boolean;
	template: CardTemplate;
	fontOverride?: CardFont | null;
	shareUrl?: string;
}

const FONT_CLASS: Record<string, string> = {
	serif: "font-serif",
	sans: "font-sans",
	mono: "font-mono",
	script: "font-script",
	display: "font-display",
};

export function CardPreview({
	song,
	selectedLines,
	allLines,
	includeArtist = true,
	includeSong = true,
	includeAlbum = true,
	template,
	fontOverride = null,
	shareUrl,
}: CardPreviewProps) {
	const effectiveFont = fontOverride ?? template.font;
	const cardRef = useRef<HTMLDivElement>(null);
	const [albumArtUrl, setAlbumArtUrl] = useState<string | null>(null);
	const [downloadOpen, setDownloadOpen] = useState(false);

	const selectedTexts = selectedLines
		.map((idx) => ({ idx, line: allLines[idx] }))
		.filter((x) => x.line);

	useEffect(() => {
		if (template.background !== "album-blur") return;
		let cancelled = false;
		fetchAlbumArt(song.artistName, song.albumName, song.trackName).then(
			(url) => {
				if (!cancelled) setAlbumArtUrl(url);
			},
		);
		return () => {
			cancelled = true;
		};
	}, [template.background, song.artistName, song.albumName, song.trackName]);

	async function handleDownload(preset: ExportPreset) {
		if (!cardRef.current) return;
		try {
			const bgColor = template.bgColor ?? template.gradientFrom ?? "#ffffff";
			const isWallpaper = preset.width > 0 && preset.height > 0;
			const options: Parameters<typeof toPng>[1] = {
				pixelRatio: isWallpaper ? 1 : 2,
				backgroundColor: bgColor,
			};
			if (isWallpaper) {
				options.canvasWidth = preset.width;
				options.canvasHeight = preset.height;
				options.style = {
					width: `${preset.width}px`,
					height: `${preset.height}px`,
					maxWidth: "none",
					aspectRatio: "auto",
				};
			}
			const dataUrl = await toPng(cardRef.current, options);
			const link = document.createElement("a");
			link.href = dataUrl;
			link.download = `lyrics-${preset.id}.png`;
			link.click();
		} catch (err) {
			console.error("Download failed:", err);
		}
	}

	function getLyricsText(): string {
		const lines = selectedTexts.map((t) => t.line);
		let text = lines.join("\n");
		const credits: string[] = [];
		if (includeArtist) credits.push(`— ${song.artistName}`);
		if (includeSong) credits.push(song.trackName);
		if (includeAlbum && song.albumName) credits.push(song.albumName);
		if (credits.length > 0) text += `\n\n${credits.join("\n")}`;
		return text;
	}

	async function handleCopyLyrics() {
		try {
			await navigator.clipboard.writeText(getLyricsText());
		} catch (err) {
			console.error("Copy failed:", err);
		}
	}

	async function handleCopyImage() {
		if (!cardRef.current) return;
		try {
			const bgColor = template.bgColor ?? template.gradientFrom ?? "#ffffff";
			const dataUrl = await toPng(cardRef.current, {
				pixelRatio: 2,
				backgroundColor: bgColor,
			});
			const blob = await fetch(dataUrl).then((r) => r.blob());
			await navigator.clipboard.write([
				new ClipboardItem({ "image/png": blob }),
			]);
		} catch (err) {
			console.error("Copy image failed:", err);
		}
	}

	async function handleCopyLink() {
		if (!shareUrl) return;
		try {
			await navigator.clipboard.writeText(shareUrl);
		} catch (err) {
			console.error("Copy link failed:", err);
		}
	}

	if (selectedTexts.length === 0) return null;

	const textColor = template.textColor ?? "#09090B";
	const accentColor = template.accentColor ?? "#3F3F46";
	const fontClass = FONT_CLASS[effectiveFont] ?? FONT_CLASS.sans;

	const bgStyle: React.CSSProperties = (() => {
		if (template.background === "solid") {
			return { backgroundColor: template.bgColor ?? "#FFFFFF" };
		}
		if (template.background === "gradient") {
			return {
				background: `linear-gradient(135deg, ${template.gradientFrom ?? "#0F0F0F"}, ${template.gradientTo ?? "#1A1A2E"})`,
			};
		}
		if (template.background === "noise") {
			return {
				backgroundColor: template.bgColor ?? "#1A1A1A",
				backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
				backgroundBlendMode: "overlay",
				opacity: 1,
			};
		}
		if (template.background === "album-blur" && albumArtUrl) {
			return {
				backgroundImage: `url(${albumArtUrl})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			};
		}
		if (template.background === "album-blur") {
			return { backgroundColor: template.bgColor ?? "#121212" };
		}
		return { backgroundColor: template.bgColor ?? "#FFFFFF" };
	})();

	const layoutTextAlign =
		template.layout === "left" ? "text-left" : "text-center";
	const layoutJustify =
		template.layout === "left" ? "justify-start" : "justify-center";

	const isQuote = template.layout === "quote";
	const isStacked = template.layout === "stacked";

	const verseSize = isQuote
		? "text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
		: isStacked
			? "text-lg md:text-xl"
			: "text-xl md:text-2xl lg:text-3xl";

	const cardAspect = template.id === "tweet" ? "aspect-square" : "";

	return (
		<div className="flex flex-col items-center gap-8">
			<div
				ref={cardRef}
				className={`relative w-full max-w-md overflow-hidden border-2 ${cardAspect} ${fontClass}`}
				style={{
					...bgStyle,
					color: textColor,
					borderColor: accentColor,
					padding:
						template.id === "poster"
							? "1.5rem"
							: template.id === "tweet"
								? "1.5rem 2rem"
								: "2rem 3rem",
				}}
			>
				{template.background === "album-blur" && albumArtUrl && (
					<>
						<div
							className="absolute inset-0 bg-cover bg-center"
							style={{
								backgroundImage: `url(${albumArtUrl})`,
								filter: "blur(24px)",
								transform: "scale(1.1)",
							}}
							aria-hidden
						/>
						<div className="absolute inset-0 bg-black/60" aria-hidden />
					</>
				)}

				<div
					className={`relative flex flex-1 flex-col ${layoutJustify} ${layoutTextAlign} mb-8 min-h-0`}
					style={{ gap: isStacked ? "0.5rem" : "1rem" }}
				>
					{isQuote ? (
						<blockquote className="m-0 space-y-4">
							{selectedTexts.map(({ idx, line }) => (
								<p
									key={`verse-${idx}`}
									className={`m-0 leading-tight ${verseSize}`}
									style={{
										color: textColor,
										fontWeight: isQuote ? 700 : 500,
									}}
								>
									{line}
								</p>
							))}
						</blockquote>
					) : (
						<div className="space-y-4">
							{selectedTexts.map(({ idx, line }) => (
								<p
									key={`verse-${idx}`}
									className={`m-0 leading-tight ${verseSize}`}
									style={{
										color: textColor,
										fontWeight: isQuote ? 700 : 500,
									}}
								>
									{line}
								</p>
							))}
						</div>
					)}
				</div>

				{(includeArtist || includeSong || includeAlbum) && (
					<div
						className={`relative border-t-2 pt-6 ${template.layout === "left" ? "text-left" : "text-center"}`}
						style={{ borderColor: accentColor }}
					>
						{includeArtist && (
							<p
								className="m-0 text-sm font-bold uppercase tracking-tighter text-opacity-80 md:text-base"
								style={{ color: textColor }}
							>
								— {song.artistName}
							</p>
						)}
						{includeSong && (
							<p
								className="m-0 text-sm md:text-base"
								style={{ color: textColor, opacity: 0.8 }}
							>
								{song.trackName}
							</p>
						)}
						{includeAlbum && song.albumName && (
							<p
								className="m-0 text-xs md:text-sm"
								style={{ color: textColor, opacity: 0.6 }}
							>
								{song.albumName}
							</p>
						)}
					</div>
				)}
			</div>
			<div className="flex flex-wrap justify-center gap-3">
				{shareUrl && (
					<button
						type="button"
						onClick={handleCopyLink}
						className="h-12 cursor-pointer border-2 border-[#3F3F46] bg-transparent px-6 font-bold uppercase tracking-tighter text-[#FAFAFA] transition-all duration-300 hover:scale-105 hover:border-[#FAFAFA] hover:bg-[#FAFAFA] hover:text-[#09090B] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#DFE104] focus:ring-offset-2 focus:ring-offset-[#09090B]"
					>
						Copy Link
					</button>
				)}
				<div className="relative">
					<button
						type="button"
						onClick={() => setDownloadOpen((o) => !o)}
						className="flex h-12 cursor-pointer items-center gap-2 border-2 border-[#3F3F46] bg-transparent px-6 font-bold uppercase tracking-tighter text-[#FAFAFA] transition-all duration-300 hover:scale-105 hover:border-[#FAFAFA] hover:bg-[#FAFAFA] hover:text-[#09090B] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#DFE104] focus:ring-offset-2 focus:ring-offset-[#09090B]"
					>
						Download
						<ChevronDown
							className={`size-4 transition-transform ${downloadOpen ? "rotate-180" : ""}`}
						/>
					</button>
					{downloadOpen && (
						<>
							<button
								type="button"
								aria-label="Close menu"
								className="fixed inset-0 z-10"
								onClick={() => setDownloadOpen(false)}
							/>
							<div className="absolute left-1/2 top-full z-20 mt-1 min-w-[220px] -translate-x-1/2 border-2 border-[#3F3F46] bg-[#09090B] py-2">
								<button
									type="button"
									onClick={() => {
										handleDownload(EXPORT_PRESETS[0]);
										setDownloadOpen(false);
									}}
									className="block w-full cursor-pointer px-4 py-2 text-left text-sm text-[#FAFAFA] hover:bg-[#27272A]"
								>
									Social Card
								</button>
								<div className="my-1 border-t border-[#3F3F46]" />
								<div className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
									Phone Wallpaper
								</div>
								{PHONE_PRESETS.map((preset) => (
									<button
										key={preset.id}
										type="button"
										onClick={() => {
											handleDownload(preset);
											setDownloadOpen(false);
										}}
										className="block w-full cursor-pointer px-4 py-2 text-left text-sm text-[#FAFAFA] hover:bg-[#27272A]"
									>
										{preset.label}
									</button>
								))}
							</div>
						</>
					)}
				</div>
				<button
					type="button"
					onClick={handleCopyLyrics}
					className="h-12 cursor-pointer border-2 border-[#3F3F46] bg-transparent px-6 font-bold uppercase tracking-tighter text-[#FAFAFA] transition-all duration-300 hover:scale-105 hover:border-[#FAFAFA] hover:bg-[#FAFAFA] hover:text-[#09090B] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#DFE104] focus:ring-offset-2 focus:ring-offset-[#09090B]"
				>
					Copy Lyrics
				</button>
				<button
					type="button"
					onClick={handleCopyImage}
					className="h-12 cursor-pointer border-2 border-[#3F3F46] bg-transparent px-6 font-bold uppercase tracking-tighter text-[#FAFAFA] transition-all duration-300 hover:scale-105 hover:border-[#FAFAFA] hover:bg-[#FAFAFA] hover:text-[#09090B] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#DFE104] focus:ring-offset-2 focus:ring-offset-[#09090B]"
				>
					Copy Image
				</button>
			</div>
		</div>
	);
}
