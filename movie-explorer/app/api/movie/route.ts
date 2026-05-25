import tmdb from "@/lib/tmdb";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const query = searchParams.get("query");
	if (query == null) {
		return Response.json({ error: "empty query" }, { status: 500 });
	}
	try {
		const data = await tmdb.search.movies({ query });
		return Response.json(data);
	} catch (err) {
		return Response.json({ error: "Failed to fetch movies" }, { status: 500 });
	}
}
