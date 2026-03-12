import {
	parseAsArrayOf,
	parseAsBoolean,
	parseAsInteger,
	parseAsStringLiteral,
} from "nuqs";
import { CARD_TEMPLATES, type CardFont } from "#/lib/card-templates";

const TEMPLATE_IDS = CARD_TEMPLATES.map((t) => t.id) as [string, ...string[]];
const FONT_IDS = ["serif", "sans", "mono", "script", "display"] as [
	CardFont,
	...CardFont[],
];

export const cardSearchParsers = {
	songId: parseAsInteger,
	lines: parseAsArrayOf(parseAsInteger).withDefault([]),
	template: parseAsStringLiteral(TEMPLATE_IDS).withDefault("minimal"),
	font: parseAsStringLiteral([...FONT_IDS, ""] as const).withDefault(""),
	includeArtist: parseAsBoolean.withDefault(true),
	includeSong: parseAsBoolean.withDefault(true),
	includeAlbum: parseAsBoolean.withDefault(true),
} as const;

export type CardSearchParams = {
	songId: number | null;
	lines: number[];
	template: (typeof TEMPLATE_IDS)[number];
	font: CardFont | "";
	includeArtist: boolean;
	includeSong: boolean;
	includeAlbum: boolean;
};

export function buildIndexUrl(params: {
	songId: number;
	lines: number[];
	template: string;
	font: string;
	includeArtist: boolean;
	includeSong: boolean;
	includeAlbum: boolean;
}): string {
	if (typeof window === "undefined") return "/";
	const search = new URLSearchParams();
	search.set("songId", String(params.songId));
	if (params.lines.length > 0) {
		search.set("lines", params.lines.join(","));
	}
	if (params.template !== "minimal") search.set("template", params.template);
	if (params.font) search.set("font", params.font);
	if (!params.includeArtist) search.set("includeArtist", "false");
	if (!params.includeSong) search.set("includeSong", "false");
	if (!params.includeAlbum) search.set("includeAlbum", "false");
	const qs = search.toString();
	return qs ? `/?${qs}` : "/";
}

export function buildCardShareUrl(params: {
	songId: number;
	lines: number[];
	template: string;
	font: string;
	includeArtist: boolean;
	includeSong: boolean;
	includeAlbum: boolean;
}): string {
	if (typeof window === "undefined") return "";
	const base = `${window.location.origin}/card/${params.songId}`;
	const search = new URLSearchParams();
	if (params.lines.length > 0) {
		search.set("lines", params.lines.join(","));
	}
	if (params.template !== "minimal") search.set("template", params.template);
	if (params.font) search.set("font", params.font);
	if (!params.includeArtist) search.set("includeArtist", "false");
	if (!params.includeSong) search.set("includeSong", "false");
	if (!params.includeAlbum) search.set("includeAlbum", "false");
	const qs = search.toString();
	return qs ? `${base}?${qs}` : base;
}
