import tmdb from "@/lib/tmdb";
import type { NextRequest } from "next/server";

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	try {
		const data = await tmdb.movies.details(Number(id));
		return Response.json(data);
	} catch {
		return Response.json({ error: "Failed to fetch movie details" }, { status: 500 });
	}
}
