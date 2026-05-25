"use client"

import { useState, useEffect } from "react";
import { type Favorite, getFavorites, removeFavorite } from "@/lib/favorites";


function FavoriteCard({ fav, onRemove }: { fav: Favorite; onRemove: () => void }) {
	return (
		<div className="flex gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
			{fav.poster ? (
				<img
					src={`https://image.tmdb.org/t/p/w92${fav.poster}`}
					alt={fav.title}
					className="w-12 h-[72px] object-cover rounded shrink-0"
				/>
			) : (
				<div className="w-12 h-[72px] rounded bg-zinc-200 dark:bg-zinc-800 shrink-0" />
			)}
			<div className="flex-1 min-w-0">
				<p className="font-medium truncate text-sm">{fav.title}</p>
				<p className="text-xs text-zinc-500">{fav.year}</p>
				<div className="text-xs text-zinc-400 italic mt-1 truncate"> my rating: {fav.rating} </div>
				{fav.note && (
					<p className="text-xs text-zinc-400 italic mt-1 truncate">{fav.note}</p>
				)}
			</div>
			<button
				onClick={onRemove}
				className="text-zinc-400 hover:text-red-500 transition-colors shrink-0 self-start pt-1 text-sm"
			>
				X
			</button>
		</div>
	);
}

export default function FavoriteList({ refreshKey, onFavoriteChange }: { refreshKey?: number; onFavoriteChange?: () => void }) {
	const [favorites, setFavorites] = useState<Favorite[]>([]);

	useEffect(() => {
		setFavorites(getFavorites());
	}, [refreshKey]);

	const handleRemove = (movieId: number) => {
		removeFavorite(movieId);
		setFavorites(getFavorites());
		onFavoriteChange?.();
	};

	return (
		<div className="flex flex-col gap-3">
			<h2 className="text-lg font-semibold">Favorites</h2>
			{favorites.length === 0 ? (
				<p className="text-zinc-400 text-sm">No favorites yet. Click a movie to add one.</p>
			) : (
				favorites.map((fav) => (
					<FavoriteCard key={fav.movieId} fav={fav} onRemove={() => handleRemove(fav.movieId)} />
				))
			)}
		</div>
	);
}
