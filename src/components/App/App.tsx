import SearchBar from "../SearchBar/SearchBar"
import styles from "./App.module.css"
import { useState } from "react"
import type { Movie } from "../../types/movie"
import toast, { Toaster } from "react-hot-toast";
import { searchMovies } from "../../api/tmbd";
import MovieGrid from "../MovieGrid/MovieGrid"
import Loader from "../Loader/Loader"
import {ErrorMessage} from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";


export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Movie | null>(null)
  
  const handleSearch = async (query: string) => {
  setMovies([]);
  setError(null); 
  setLoading(true)
  try {
      const list = await searchMovies(query, 1);
      if (!list.length) {
        toast("No movies found for your request.");
      }
      setMovies(list);
  } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message || "Request failed"); 
      toast.error(message || "Search failed");
  } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage />
      ) : (
        <MovieGrid movies={movies} onSelect={setSelected} />
      )}


      {selected && (
        <MovieModal movie={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}