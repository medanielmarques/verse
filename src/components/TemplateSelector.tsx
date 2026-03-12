import type { CardTemplate } from "#/lib/card-templates";
import { CARD_TEMPLATES } from "#/lib/card-templates";

interface TemplateSelectorProps {
	value: CardTemplate;
	onChange: (template: CardTemplate) => void;
}

export function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
	return (
		<div className="flex flex-wrap justify-center gap-3">
			{CARD_TEMPLATES.map((template) => {
				const isSelected = value.id === template.id;
				return (
					<button
						key={template.id}
						type="button"
						onClick={() => onChange(template)}
						className={`flex cursor-pointer flex-col items-center gap-1 rounded border-2 px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#DFE104] focus:ring-offset-2 focus:ring-offset-[#09090B] ${
							isSelected
								? "border-[#DFE104] bg-[#DFE104] text-[#000000]"
								: "border-[#3F3F46] bg-transparent text-[#FAFAFA] hover:border-[#DFE104] hover:bg-[#DFE104] hover:text-[#000000]"
						}`}
					>
						<span className="text-sm font-bold uppercase tracking-wider">
							{template.name}
						</span>
					</button>
				);
			})}
		</div>
	);
}
