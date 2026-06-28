import axios from "axios";
import type { Movie } from "../types/movie";

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const BASE_URL = "https://api.themoviedb.org/3/search/movie";

export const fetchMovies = async (
  query: string,
  page: number,
): Promise<MoviesResponse> => {
  const token = import.meta.env.VITE_TMDB_TOKEN;

  const response = await axios.get<MoviesResponse>(BASE_URL, {
    params: { query, page },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
