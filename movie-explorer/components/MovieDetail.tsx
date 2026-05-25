"use client"

import type { MovieDetails } from "tmdb-ts";
import { useEffect, useState } from "react";
import { getFavorites, hasFavorite, addFavorite, removeFavorite, updateFavorites } from "@/lib/favorites";

type MovieDetailProps = {
	id: number;
	onFavoriteChange?: () => void;
}

function RatingInput({ value, onChange }: { value: number | null; onChange: (n: number) => void }) {
	return (
		<input
			type="number"
			min={0}
			max={5}
			value={value ?? ""}
			onChange={(e) => {
				const n = Number(e.target.value);
				if (n >= 0 && n <= 5) onChange(n);
			}}
			placeholder="0–5"
			className="w-20 text-sm p-2 rounded border border-zinc-200 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-1 focus:ring-zinc-400"
		/>
	);
}

export default function MovieDetail({ id, onFavoriteChange }: MovieDetailProps) {
	const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
	const [isFav, setIsFav] = useState(false);
	const [rating, setRating] = useState<number | null>(null);
	const [note, setNote] = useState("");

	useEffect(() => {
		fetch(`/api/movie/${id}`)
			.then(async (res) => {
				if (!res.ok) throw new Error("Network response was not ok");
				return res.json();
			})
			.then((data) => {
				setMovieDetails(data);
			})
			.catch((err) => {
				console.error("Failed to fetch movie details: " + err);
			});

		// load existing favorite state
		const existing = getFavorites().find((f) => f.movieId === id);
		setIsFav(hasFavorite(id));
		setRating(existing?.rating ?? null);
		setNote(existing?.note ?? "");
	}, [id]);

	const handleAddFavorite = () => {
		if (!movieDetails) return;
		addFavorite({
			movieId: movieDetails.id,
			title: movieDetails.original_title,
			poster: movieDetails.poster_path ?? "",
			year: movieDetails.release_date?.slice(0, 4) ?? "",
			overview: movieDetails.overview,
			runtime: movieDetails.runtime ?? null,
			rating: null,
			note: null,
			addedAt: new Date().toISOString(),
		});
		setIsFav(true);
		onFavoriteChange?.();
	};

	const handleRemoveFavorite = () => {
		removeFavorite(id);
		setIsFav(false);
		setRating(null);
		setNote("");
		onFavoriteChange?.();
	};

	const handleRatingChange = (n: number) => {
		setRating(n);
		updateFavorites(id, { rating: n });
		onFavoriteChange?.();
	};

	const handleNoteBlur = () => {
		updateFavorites(id, { note: note || null });
		onFavoriteChange?.();
	};

	if (!movieDetails) return <div className="p-4 text-zinc-500">Loading...</div>;

	return (
		<div className="flex flex-col gap-4 p-2">
			<h2 className="text-xl font-semibold">{movieDetails.original_title}</h2>
			<ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
				<li>Release: {movieDetails.release_date}</li>
				<li>Rating: {movieDetails.vote_average?.toFixed(1)}</li>
				<li>Runtime: {movieDetails.runtime} min</li>
			</ul>
			<p className="text-sm leading-relaxed">{movieDetails.overview}</p>

			<hr className="border-zinc-200 dark:border-zinc-800" />

			{/* favorites section */}
			{!isFav ? (
				<button
					onClick={handleAddFavorite}
					className="self-start text-sm px-3 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
				>
					Add to favorites
				</button>
			) : (
				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">Your rating</span>
						<button
							onClick={handleRemoveFavorite}
							className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
						>
							Remove from favorites
						</button>
					</div>
					<RatingInput value={rating} onChange={handleRatingChange} />
					<textarea
						value={note}
						onChange={(e) => setNote(e.target.value)}
						onBlur={handleNoteBlur}
						placeholder="Add a note..."
						rows={3}
						className="text-sm p-2 rounded border border-zinc-200 dark:border-zinc-700 bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-zinc-400"
					/>
				</div>
			)}
		</div>
	);
}
