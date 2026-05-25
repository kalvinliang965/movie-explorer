import Movie from "@/app/movie/page";

export default function Home() {
	return (
		<div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black">
			<main className="flex flex-row flex-1 w-full max-w-6xl mx-auto gap-6 py-8 px-6 bg-white dark:bg-black">
				<div className="basis-1/2 min-w-0">
					<Movie query="abc" />
				</div>
				<div className="basis-1/2 min-w-0">view2</div>
			</main>
		</div>
	);
}
