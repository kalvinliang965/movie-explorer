"use client"

import type { MovieDetails } from "tmdb-ts";
import { useEffect, useState } from "react";
import { getFavorites, hasFavorite, addFavorite, removeFavorite, updateFavorites } from "@/lib/favorites";

type MovieDetailProps = {
	id: number;
	syncKey?: number;
	onFavoriteChange?: () => void;
}

function RatingInput({ value, onChange }: { value: number | null; onChange: (n: number) => void }) {
	return (
		<input
			type="number"
			min={1}
			max={5}
			value={value ?? ""}
			onChange={(e) => {
				const n = Number(e.target.value);
				if (n >= 1 && n <= 5) onChange(n);
			}}
			placeholder="1–5"
			className="w-20 text-sm p-2 rounded border border-zinc-200 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-1 focus:ring-zinc-400"
		/>
	);
}

export default function MovieDetail({ id, syncKey, onFavoriteChange }: MovieDetailProps) {
	const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isFav, setIsFav] = useState(false);
	const [rating, setRating] = useState<number | null>(null);
	const [note, setNote] = useState("");

	useEffect(() => {
		setError(null);
		fetch(`/api/movie/${id}`)
			.then(async (res) => {
				if (!res.ok) throw new Error("Failed to load movie details");
				return res.json();
			})
			.then((data) => {
				setMovieDetails(data);
			})
			.catch((err) => {
				setError(err.message);
			});

		// load existing favorite state
		const existing = getFavorites().find((f) => f.movieId === id);
		setIsFav(hasFavorite(id));
		setRating(existing?.rating ?? null);
		setNote(existing?.note ?? "");
	}, [id, syncKey]);

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

	if (error) return <p className="p-4 text-red-500 text-sm">Error: {error}</p>;
	if (!movieDetails) return <div className="p-4 text-zinc-500">Loading...</div>;

	return (
		<div className="flex flex-col gap-4 p-2">
			<div className="flex gap-4">
				{movieDetails.poster_path ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={`https://image.tmdb.org/t/p/w185${movieDetails.poster_path}`}
						alt={movieDetails.original_title}
						className="w-24 rounded shrink-0 self-start"
					/>
				) : (
					<div className="w-24 h-36 rounded bg-zinc-200 dark:bg-zinc-800 shrink-0" />
				)}
				<div className="flex flex-col gap-1">
					<h2 className="text-xl font-semibold">{movieDetails.original_title}</h2>
					<ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 mt-1">
						<li>Release: {movieDetails.release_date}</li>
						<li>Rating: {movieDetails.vote_average?.toFixed(1)}</li>
						<li>Runtime: {movieDetails.runtime} min</li>
					</ul>
				</div>
			</div>
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
