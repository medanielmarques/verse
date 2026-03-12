import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryStates } from "nuqs";
import { CardPreview } from "#/components/CardPreview";
import {
	buildCardShareUrl,
	buildIndexUrl,
	cardSearchParsers,
} from "#/lib/card-search-params";
import type { CardFont } from "#/lib/card-templates";
import { CARD_TEMPLATES } from "#/lib/card-templates";
import { getSongById } from "#/lib/lrclib";

export const Route = createFileRoute("/card/$songId")({
	component: CardRoute,
});

function parseLyrics(
	song: { plainLyrics?: string; syncedLyrics?: string } | null,
) {
	if (!song) return [];
	const raw = song.plainLyrics || song.syncedLyrics || "";
	return raw
		.split("\n")
		.filter(Boolean)
		.map((line) => line.replace(/^\[\d+:\d+\.\d+\]\s*/, "").trim());
}

function CardRoute() {
	const { songId: songIdParam } = Route.useParams();
	const songId = Number.parseInt(songIdParam, 10);

	const [
		{
			lines: selectedLines,
			template: templateId,
			font: fontParam,
			includeArtist,
			includeSong,
			includeAlbum,
		},
	] = useQueryStates(cardSearchParsers);

	const {
		data: selectedSong,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["song", songId],
		queryFn: () => getSongById(songId),
		enabled: !Number.isNaN(songId),
	});

	const template =
		CARD_TEMPLATES.find((t) => t.id === templateId) ?? CARD_TEMPLATES[0];
	const fontOverride: CardFont | null =
		fontParam === "" ? null : (fontParam as CardFont);

	const allLines = selectedSong ? parseLyrics(selectedSong) : [];
	const hasSelection = selectedSong && selectedLines.length > 0;

	if (Number.isNaN(songId)) {
		return (
			<main className="min-h-screen px-4 py-32">
				<div className="mx-auto max-w-[95vw] text-center">
					<p className="mb-6 text-xl text-[#A1A1AA]">Invalid song ID</p>
					<Link to="/" className="text-[#DFE104] underline hover:no-underline">
						Create a card
					</Link>
				</div>
			</main>
		);
	}

	if (isLoading && !selectedSong) {
		return (
			<main className="min-h-screen px-4 py-32">
				<div className="mx-auto max-w-[95vw] text-center">
					<p className="text-xl text-[#A1A1AA]">Loading...</p>
				</div>
			</main>
		);
	}

	if (error || !selectedSong) {
		return (
			<main className="min-h-screen px-4 py-32">
				<div className="mx-auto max-w-[95vw] text-center">
					<p className="mb-6 text-xl text-[#A1A1AA]">Song not found</p>
					<Link to="/" className="text-[#DFE104] underline hover:no-underline">
						Create a card
					</Link>
				</div>
			</main>
		);
	}

	if (!hasSelection) {
		return (
			<main className="min-h-screen px-4 py-32">
				<div className="mx-auto max-w-[95vw] text-center">
					<p className="mb-6 text-xl text-[#A1A1AA]">
						No verses selected. Add ?lines=0,1,2 to the URL.
					</p>
					<Link
						to={buildIndexUrl({
							songId,
							lines: [],
							template: templateId,
							font: fontParam,
							includeArtist,
							includeSong,
							includeAlbum,
						})}
						className="text-[#DFE104] underline hover:no-underline"
					>
						Edit this card
					</Link>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen px-4 py-32">
			<div className="mx-auto max-w-[95vw]">
				<div className="mb-8 flex justify-center">
					<Link
						to={buildIndexUrl({
							songId: selectedSong.id,
							lines: selectedLines,
							template: templateId,
							font: fontParam,
							includeArtist,
							includeSong,
							includeAlbum,
						})}
						className="text-sm font-bold uppercase tracking-widest text-[#A1A1AA] transition-colors hover:text-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#DFE104] focus:ring-offset-2 focus:ring-offset-[#09090B]"
					>
						← Edit card
					</Link>
				</div>
				<CardPreview
					song={selectedSong}
					selectedLines={selectedLines}
					allLines={allLines}
					includeArtist={includeArtist}
					includeSong={includeSong}
					includeAlbum={includeAlbum}
					template={template}
					fontOverride={fontOverride}
					shareUrl={buildCardShareUrl({
						songId: selectedSong.id,
						lines: selectedLines,
						template: templateId,
						font: fontParam,
						includeArtist,
						includeSong,
						includeAlbum,
					})}
				/>
			</div>
		</main>
	);
}
