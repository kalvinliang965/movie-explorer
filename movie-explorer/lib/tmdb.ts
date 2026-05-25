import { TMDB } from "tmdb-ts"

const tmdb = new TMDB(process.env.TMDB_KEY || "accessionKey");

export default tmdb;

