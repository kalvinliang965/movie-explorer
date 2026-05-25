"use client"

import type { MovieDetails } from "tmdb-ts";
import { useState, useEffect } from "react";

type MovieDetailProps = {
	id: number;
}

export default function MovieDetail({ id }: MovieDetailProps) {
	const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);

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
	}, [id]);

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
		</div>
	);
}
