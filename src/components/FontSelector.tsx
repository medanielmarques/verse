import type { CardFont } from "#/lib/card-templates";
import { CARD_FONTS } from "#/lib/card-templates";

interface FontSelectorProps {
	value: CardFont;
	onChange: (font: CardFont) => void;
}

export function FontSelector({ value, onChange }: FontSelectorProps) {
	return (
		<div className="flex flex-wrap justify-center gap-2">
			{CARD_FONTS.map((font) => {
				const isSelected = value === font.id;
				return (
					<button
						key={font.id}
						type="button"
						onClick={() => onChange(font.id)}
						className={`flex cursor-pointer items-center justify-center rounded border-2 px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#DFE104] focus:ring-offset-2 focus:ring-offset-[#09090B] ${
							isSelected
								? "border-[#DFE104] bg-[#DFE104] text-[#000000]"
								: "border-[#3F3F46] bg-transparent text-[#FAFAFA] hover:border-[#DFE104] hover:bg-[#DFE104] hover:text-[#000000]"
						}`}
						style={{
							fontFamily:
								font.id === "serif"
									? "var(--font-serif)"
									: font.id === "sans"
										? "var(--font-sans)"
										: font.id === "mono"
											? "var(--font-mono)"
											: font.id === "script"
												? "var(--font-script)"
												: "var(--font-display)",
						}}
					>
						{font.name}
					</button>
				);
			})}
		</div>
	);
}
