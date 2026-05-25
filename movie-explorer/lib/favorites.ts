// structure inside localStorage
export type Favorite = {
	movieId: number,
	title: string,
	poster: string,
	year: string,
	overview: string,
	runtime: number | null,
	rating: number | null,
	note: string | null,
	addedAt: string,
}

// key for localstorage
const KEY = "favorites";

export function getFavorites(): Favorite[] {
	if (typeof window === "undefined") return [];
	return JSON.parse(localStorage.getItem(KEY) || "[]") as Favorite[];
}

export function hasFavorite(movieId: number) {
	const favorites = getFavorites();
	return favorites.some(f => f.movieId === movieId);
}


export function addFavorite(movie: Favorite) {
	if (hasFavorite(movie.movieId)) {
		throw new Error("movie already exists in localStorage");
	}
	const favorites = getFavorites();
	localStorage.setItem(KEY, JSON.stringify([...favorites, movie]));
}

export function removeFavorite(movieId: number) {
	if (!hasFavorite(movieId)) {
		throw new Error("removeFavorite: movie does not exist");
	}
	const favorites = getFavorites().filter(f => f.movieId !== movieId);
	localStorage.setItem(KEY, JSON.stringify(favorites));
}

export function updateFavorites(movieId: number, updates: Partial<Favorite>) {
	if (!hasFavorite(movieId)) {
		throw new Error("updateFavorites: movie does not exists");
	}
	const favorites = getFavorites().map(f => {
		if (f.movieId === movieId) {
			return { ...f, ...updates };
		}
		return f;
	});
	localStorage.setItem(KEY, JSON.stringify(favorites));
}


