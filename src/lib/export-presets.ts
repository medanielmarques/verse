export interface ExportPreset {
	id: string;
	label: string;
	width: number;
	height: number;
	category: "social" | "phone" | "desktop";
}

export const EXPORT_PRESETS: ExportPreset[] = [
	{
		id: "social",
		label: "Social Card",
		width: 0,
		height: 0,
		category: "social",
	},
	{
		id: "phone-1080",
		label: "Phone (1080×1920)",
		width: 1080,
		height: 1920,
		category: "phone",
	},
	{
		id: "phone-1170",
		label: "Phone (1170×2532)",
		width: 1170,
		height: 2532,
		category: "phone",
	},
	{
		id: "desktop-1080",
		label: "Desktop (1920×1080)",
		width: 1920,
		height: 1080,
		category: "desktop",
	},
	{
		id: "desktop-1440",
		label: "Desktop (2560×1440)",
		width: 2560,
		height: 1440,
		category: "desktop",
	},
];

export const SOCIAL_PRESET =
	EXPORT_PRESETS.find((p) => p.category === "social") ?? EXPORT_PRESETS[0];
export const PHONE_PRESETS = EXPORT_PRESETS.filter(
	(p) => p.category === "phone",
);
export const DESKTOP_PRESETS = EXPORT_PRESETS.filter(
	(p) => p.category === "desktop",
);
