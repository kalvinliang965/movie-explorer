"use client"

import MovieList from "@/components/MovieList";
import MovieDetail from "@/components/MovieDetail";
import FavoriteList from "@/components/FavoriteList";
import { useState } from "react";

export default function Home() {
	const [search, setSearch] = useState("");
	const [query, setQuery] = useState("");
	// navgivate to detail search view
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [favKey, setFavKey] = useState(0);

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
						{selectedId !== null ? (
							<div>
								<button
									className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 mb-4"
									onClick={() => setSelectedId(null)}
								>
									Back
								</button>
								<MovieDetail id={selectedId} syncKey={favKey} onFavoriteChange={() => setFavKey(k => k + 1)} />
							</div>
						) : (
							<MovieList query={query} action={setSelectedId} />
						)}
					</div>
					<div className="basis-1/2 min-w-0">
							<FavoriteList refreshKey={favKey} onFavoriteChange={() => setFavKey(k => k + 1)} />
						</div>
				</div>
			</main>
		</div>
	);
}
