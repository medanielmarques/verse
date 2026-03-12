import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryStates } from "nuqs";
import { CardPreview } from "#/components/CardPreview";
import { FontSelector } from "#/components/FontSelector";
import { LyricsSearch } from "#/components/LyricsSearch";
import { TemplateSelector } from "#/components/TemplateSelector";
import { buildCardShareUrl, cardSearchParsers } from "#/lib/card-search-params";
import type { CardFont } from "#/lib/card-templates";
import { CARD_TEMPLATES } from "#/lib/card-templates";
import type { LrclibSong } from "#/lib/lrclib";
import { getSongById } from "#/lib/lrclib";

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
	const [
		{
			songId,
			lines: selectedLines,
			template: templateId,
			font: fontParam,
			includeArtist,
			includeSong,
			includeAlbum,
		},
		setParams,
	] = useQueryStates(cardSearchParsers);

	const { data: selectedSong } = useQuery({
		queryKey: ["song", songId],
		queryFn: async () => {
			if (songId == null) return null;
			return getSongById(songId);
		},
		enabled: songId != null,
	});

	const template =
		CARD_TEMPLATES.find((t) => t.id === templateId) ?? CARD_TEMPLATES[0];
	const fontOverride: CardFont | null =
		fontParam === "" ? null : (fontParam as CardFont);

	function handleSelectSong(song: LrclibSong | null) {
		setParams({
			songId: song?.id ?? null,
			lines: [],
		});
	}

	function handleSelectLines(updater: React.SetStateAction<number[]>) {
		setParams((prev) => ({
			lines: typeof updater === "function" ? updater(prev.lines) : updater,
		}));
	}

	const allLines = selectedSong ? parseLyrics(selectedSong) : [];
	const hasSelection = selectedSong && selectedLines.length > 0;

	return (
		<main className="min-h-screen">
			<section className="page-wrap px-4 py-32">
				<div className="mx-auto max-w-[95vw]">
					<p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#A1A1AA] md:text-sm lg:text-lg">
						Lyrics Search
					</p>
					<div className="border-2 border-[#3F3F46] bg-[#09090B] p-8 md:p-12">
						<div className="flex flex-col gap-12">
							{hasSelection && selectedSong && (
								<div className="flex flex-col gap-6">
									<div className="flex flex-wrap gap-6">
										<div>
											<p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#A1A1AA]">
												Template
											</p>
											<TemplateSelector
												value={template}
												onChange={(t) => setParams({ template: t.id })}
											/>
										</div>
										<div>
											<p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#A1A1AA]">
												Font
											</p>
											<FontSelector
												value={fontOverride ?? template.font}
												onChange={(f) =>
													setParams({
														font: f ?? "",
													})
												}
											/>
										</div>
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
									<div className="flex flex-wrap justify-center gap-4 text-sm text-[#FAFAFA]">
										<label className="flex cursor-pointer items-center gap-2">
											<input
												type="checkbox"
												checked={includeArtist}
												onChange={(e) =>
													setParams({
														includeArtist: e.target.checked,
													})
												}
												className="h-5 w-5 shrink-0 cursor-pointer accent-[#DFE104]"
											/>
											<span className="uppercase tracking-widest">Artist</span>
										</label>
										<label className="flex cursor-pointer items-center gap-2">
											<input
												type="checkbox"
												checked={includeSong}
												onChange={(e) =>
													setParams({
														includeSong: e.target.checked,
													})
												}
												className="h-5 w-5 shrink-0 cursor-pointer accent-[#DFE104]"
											/>
											<span className="uppercase tracking-widest">Song</span>
										</label>
										<label className="flex cursor-pointer items-center gap-2">
											<input
												type="checkbox"
												checked={includeAlbum}
												onChange={(e) =>
													setParams({
														includeAlbum: e.target.checked,
													})
												}
												className="h-5 w-5 shrink-0 cursor-pointer accent-[#DFE104]"
											/>
											<span className="uppercase tracking-widest">Album</span>
										</label>
									</div>
								</div>
							)}

							<div className="min-w-0">
								<LyricsSearch
									selectedSong={selectedSong ?? null}
									onSelectSong={handleSelectSong}
									selectedLines={selectedLines}
									onSelectLines={handleSelectLines}
								/>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
