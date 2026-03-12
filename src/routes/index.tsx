import { createFileRoute } from "@tanstack/react-router";
import {
	motion,
	useMotionValueEvent,
	useReducedMotion,
	useScroll,
} from "framer-motion";
import { useState } from "react";
import Marquee from "react-fast-marquee";
import { CardPreview } from "#/components/CardPreview";
import type { LrclibSong } from "#/components/LyricsSearch";
import { LyricsSearch } from "#/components/LyricsSearch";

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
	const [selectedSong, setSelectedSong] = useState<LrclibSong | null>(null);
	const [selectedLines, setSelectedLines] = useState<number[]>([]);
	const [showCard, setShowCard] = useState(false);

	const prefersReducedMotion = useReducedMotion();
	const { scrollYProgress } = useScroll();
	const [scale, setScale] = useState(1);
	const [opacity, setOpacity] = useState(1);

	useMotionValueEvent(scrollYProgress, "change", (latest) => {
		if (prefersReducedMotion) return;
		if (latest < 0.2) {
			setScale(1 + latest * 1);
			setOpacity(1 - latest * 5);
		} else {
			setScale(1.2);
			setOpacity(0);
		}
	});

	function handleSelectSong(song: typeof selectedSong) {
		setSelectedSong(song);
		setSelectedLines([]);
		setShowCard(false);
	}

	const allLines = selectedSong ? parseLyrics(selectedSong) : [];

	return (
		<main className="min-h-screen">
			{/* Hero with parallax */}
			<section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4 py-32">
				<motion.div
					className="absolute inset-0 flex items-center justify-center"
					style={{ scale, opacity }}
				>
					<h1 className="text-center font-bold uppercase leading-[0.8] tracking-tighter text-[#FAFAFA] [text-shadow:0_0_80px_rgba(0,0,0,0.5)] [font-size:clamp(3rem,12vw,14rem)]">
						Verse
					</h1>
				</motion.div>
				<span
					className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 font-bold text-[#27272A] md:right-16 md:text-[8rem] lg:text-[12rem]"
					aria-hidden
				>
					01
				</span>
			</section>

			{/* Stats marquee */}
			<section className="border-y-2 border-[#3F3F46] bg-[#DFE104] py-6">
				{prefersReducedMotion ? (
					<div className="flex flex-wrap justify-center gap-8 px-4">
						{[
							{ num: "10K+", label: "LYRICS" },
							{ num: "∞", label: "VERSES" },
							{ num: "01", label: "CARD" },
							{ num: "100%", label: "FREE" },
						].map((item, i) => (
							<div key={i} className="flex items-baseline gap-4 text-[#000000]">
								<span className="text-4xl font-bold md:text-6xl lg:text-8xl">
									{item.num}
								</span>
								<span className="text-sm font-bold uppercase tracking-widest md:text-base">
									{item.label}
								</span>
							</div>
						))}
					</div>
				) : (
					<Marquee speed={80} gradient={false} className="[&>div]:flex">
						{[
							{ num: "10K+", label: "LYRICS" },
							{ num: "∞", label: "VERSES" },
							{ num: "01", label: "CARD" },
							{ num: "100%", label: "FREE" },
						].map((item) => (
							<div
								key={item.label}
								className="mx-12 flex items-baseline gap-4 text-[#000000]"
							>
								<span className="text-4xl font-bold md:text-6xl lg:text-8xl">
									{item.num}
								</span>
								<span className="text-sm font-bold uppercase tracking-widest md:text-base">
									{item.label}
								</span>
							</div>
						))}
					</Marquee>
				)}
			</section>

			{/* Main content */}
			<section className="page-wrap px-4 py-32">
				<div className="mx-auto max-w-[95vw]">
					<p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#A1A1AA] md:text-sm lg:text-lg">
						Lyrics Search
					</p>
					<div className="border-2 border-[#3F3F46] bg-[#09090B] p-8 md:p-12">
						<LyricsSearch
							selectedSong={selectedSong}
							onSelectSong={handleSelectSong}
							selectedLines={selectedLines}
							onSelectLines={setSelectedLines}
							onShowCard={setShowCard}
						/>
					</div>
				</div>
			</section>

			{showCard && selectedSong && selectedLines.length > 0 && (
				<section className="page-wrap border-t-2 border-[#3F3F46] px-4 py-32">
					<div className="group mx-auto max-w-[95vw]">
						<div className="border-2 border-[#3F3F46] bg-[#09090B] p-8 transition-colors duration-300 hover:border-[#DFE104] hover:bg-[#DFE104] md:p-12">
							<CardPreview
								song={selectedSong}
								selectedLines={selectedLines}
								allLines={allLines}
							/>
						</div>
					</div>
				</section>
			)}
		</main>
	);
}
