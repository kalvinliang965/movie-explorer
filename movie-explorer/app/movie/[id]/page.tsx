"use client"

import type { MovieDetails } from "tmdb-ts";
import { use, useState, useEffect } from "react";


type MovieDetailProps = {
	params: Promise<{ id: string }>
}

export default function MovieDetail(props: MovieDetailProps) {

	const { id } = use(props.params);
	const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);

	useEffect(() => {
		fetch(`/api/movie/${id}`)
			.then(async (res) => {
				if (!res.ok) throw new Error("Network response was not ok fetching for movie detail view");
				return res.json();
			})
			.then((data) => {
				setMovieDetails(data);
			})
			.catch((err) => {
				console.error("Failed to fetch movie " + err);
			})
	}, []);

	return (
		<div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
			<h2>
				Search Results:
				{
					(movieDetails != null) ? (
						<div>
							<li>movie id: {movieDetails.id}</li>
							<li>original title: {movieDetails.original_title}</li>
							<li>overview: {movieDetails.overview}</li>
							<li>release date: {movieDetails.release_date}</li>
							<li>adult: {movieDetails.adult}</li>
							<li>popularity: {movieDetails.popularity}</li>
						</div>
					) : (<div></div>)

				}
			</h2>

		</div>
	);
}
