import axios from "axios";
import type { Movie } from "../types/movie";

const TMDB_API = "https://api.themoviedb.org/3";
const token = import.meta.env.VITE_TMDB_TOKEN; // Read Access Token (v4)

if (!token) {
  throw new Error("Missing VITE_TMDB_TOKEN env variable");
}

const client = axios.create({
  baseURL: TMDB_API,
  headers: { Authorization: `Bearer ${token}` },
});

interface TMDBSearchResponse {
  results: Movie[];
}

// Тип для можливих помилок TMDB
interface TMDBErrorPayload {
  status_message?: string;
  status_code?: number;
  success?: boolean;
  errors?: string[];
}

export async function searchMovies(query: string, page = 1): Promise<Movie[]> {
  try {
    const { data } = await client.get<TMDBSearchResponse>("/search/movie", {
      params: {
        query,
        page,
        include_adult: false,
        language: "en-US",
      },
    });
    return data?.results ?? [];
  } catch (err: unknown) {
    // Без any: звужуємо тип і дістаємо повідомлення
    if (axios.isAxiosError<TMDBErrorPayload>(err)) {
      const status = err.response?.status;
      const payload = err.response?.data;
      const apiMsg = payload?.status_message ?? payload?.errors?.[0];
      const msg = apiMsg ?? err.message ?? "TMDB request failed";
      throw new Error(`TMDB error${status ? " " + status : ""}: ${msg}`);
    }
    if (err instanceof Error) {
      throw new Error(`TMDB error: ${err.message}`);
    }
    throw new Error("TMDB error: Unknown error");
  }
}