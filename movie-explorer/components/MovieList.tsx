"use client"

import type { Movie } from "tmdb-ts";
import { useState, useEffect } from "react";

export type MovieListProps = {
	query: string;
	action?: (id: number) => void;
}

type MovieCard = {
	id: number;
	title: string;
	posterPath: string | null;
	year: string;
	overview: string;
	rating: number;
}

function toCard(m: Movie): MovieCard {
	return {
		id: m.id,
		title: m.title,
		posterPath: m.poster_path,
		year: m.release_date?.slice(0, 4) ?? "—",
		overview: m.overview,
		rating: m.vote_average,
	};
}

function MovieCard({ movie, action }: { movie: MovieCard; action?: (id: number) => void }) {
	return (
		<div
			className="flex gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
			onClick={() => action?.(movie.id)}
		>
			{movie.posterPath ? (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					src={`https://image.tmdb.org/t/p/w92${movie.posterPath}`}
					alt={movie.title}
					className="w-16 h-24 object-cover rounded shrink-0"
				/>
			) : (
				<div className="w-16 h-24 rounded bg-zinc-200 dark:bg-zinc-800 shrink-0" />
			)}
			<div className="flex-1 min-w-0">
				<h3 className="font-medium truncate">{movie.title}</h3>
				<p className="text-xs text-zinc-500 mt-0.5">{movie.year} · ⭐ {movie.rating.toFixed(1)}</p>
				<p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">{movie.overview}</p>
			</div>
		</div>
	);
}

export default function MovieList({ query, action }: MovieListProps) {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!query) return;
		setLoading(true);
		setError(null);
		fetch(`/api/movie?query=${encodeURIComponent(query)}`)
			.then(async (res) => {
				if (!res.ok) throw new Error("Failed to fetch results");
				return res.json();
			})
			.then((data) => {
				setMovies(data.results || []);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, [query]);

	if (!query) return <p className="text-zinc-400 text-sm">Search for a movie above.</p>;
	if (loading) return <p className="text-zinc-400 text-sm">Loading...</p>;
	if (error) return <p className="text-red-500 text-sm">Error: {error}</p>;
	if (movies.length === 0) return <p className="text-zinc-400 text-sm">No results for "{query}".</p>;

	return (
		<div className="flex flex-col gap-3">
			<h2 className="text-lg font-semibold">Search Results</h2>
			{movies.map((movie) => (
				<MovieCard key={movie.id} movie={toCard(movie)} action={action} />
			))}
		</div>
	);
}
