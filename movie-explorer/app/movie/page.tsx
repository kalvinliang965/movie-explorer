"use client"

import type { Movie } from "tmdb-ts";
import { useState, useEffect } from "react";


export type MovieProps = {
	query: string,
}

export default function Movie(props: MovieProps) {

	const [movies, setMovies] = useState([] as Movie[]);

	useEffect(() => {
		fetch(`/api/movie?query=${props.query}`)
			.then(async (res) => {
				if (!res.ok) throw new Error("Network response was not ok");
				return res.json();
			})
			.then((data) => {
				setMovies(data.results || []);
			})
			.catch((err) => {
				console.error("Failed to fetch movie " + err);
			})
	}, []);

	return (
		<div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
			<h2>Search Results:</h2>
			{movies.map((movie) => (
				<pre
					key={movie.id}
					style={{
						background: 'black',
						padding: '10px',
						borderRadius: '4px',
						marginBottom: '10px',
						overflowX: 'auto'
					}}
				>
					{JSON.stringify(movie, null, 2)}
				</pre>
			))}
		</div>
	);
}
