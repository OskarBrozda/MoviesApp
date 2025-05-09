// api/tmdbApi.ts
import axios from "axios";
// eslint-disable-next-line import/no-unresolved
import { TMDB_API_KEY } from "@env";

const tmdbApi = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: TMDB_API_KEY,
    language: "pl-PL",
  },
});

export default tmdbApi;
