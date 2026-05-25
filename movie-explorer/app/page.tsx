"use client"

import Movie from "@/app/movie/page";
import { useState } from "react";

export default function Home() {
	const [search, setSearch] = useState("");
	const [query, setQuery] = useState("");

	const handleSubmit = (e: any) => {
		e.preventDefault();
		setQuery(search);
	}

	return (
		<div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black">
			<main className="flex flex-col flex-1 w-full max-w-6xl mx-auto py-8 px-6 gap-6 bg-white dark:bg-black">
				<div className="w-full">
					<form onSubmit={handleSubmit}>
						<label className="block mb-2 text-sm font-medium">Search box:</label>
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Type and press Enter..."
							className="border p-2 rounded w-full max-w-md dark:bg-zinc-800 dark:text-white"
						/>
					</form>
				</div>
				<div className="flex flex-row flex-1 gap-6">
					<div className="basis-1/2 min-w-0">
						<Movie query={query} />
					</div>
					<div className="basis-1/2 min-w-0">view2</div>
				</div>
			</main>
		</div>
	);
}
