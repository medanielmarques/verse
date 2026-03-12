export type CardFont = "serif" | "sans" | "mono" | "script" | "display";

export type CardBackground =
	| "solid"
	| "gradient"
	| "noise"
	| "album-blur"
	| "photo";

export type CardLayout = "center" | "left" | "quote" | "stacked";

export interface CardTemplate {
	id: string;
	name: string;
	font: CardFont;
	background: CardBackground;
	layout: CardLayout;
	accentColor?: string;
	bgColor?: string;
	textColor?: string;
	gradientFrom?: string;
	gradientTo?: string;
}

export const CARD_TEMPLATES: CardTemplate[] = [
	{
		id: "minimal",
		name: "Minimal",
		font: "serif",
		background: "solid",
		layout: "center",
		bgColor: "#FFFFFF",
		textColor: "#09090B",
	},
	{
		id: "spotify",
		name: "Spotify",
		font: "sans",
		background: "album-blur",
		layout: "center",
		accentColor: "#1DB954",
		bgColor: "#121212",
		textColor: "#FFFFFF",
	},
	{
		id: "poster",
		name: "Poster",
		font: "display",
		background: "gradient",
		layout: "quote",
		gradientFrom: "#0F0F0F",
		gradientTo: "#1A1A2E",
		textColor: "#FAFAFA",
		accentColor: "#E94560",
	},
	{
		id: "tweet",
		name: "Tweet",
		font: "sans",
		background: "solid",
		layout: "stacked",
		bgColor: "#FFFFFF",
		textColor: "#0F1419",
	},
];

export const CARD_FONTS: { id: CardFont; name: string; googleFont: string }[] =
	[
		{ id: "serif", name: "Serif", googleFont: "Lora" },
		{ id: "sans", name: "Sans", googleFont: "Inter" },
		{ id: "mono", name: "Mono", googleFont: "JetBrains Mono" },
		{ id: "script", name: "Script", googleFont: "Dancing Script" },
		{ id: "display", name: "Display", googleFont: "Bebas Neue" },
	];
