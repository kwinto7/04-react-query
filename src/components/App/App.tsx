import SearchBar from "../SearchBar/SearchBar";
import styles from "./App.module.css";
import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import ReactPaginate from "react-paginate";
import { useQuery } from "@tanstack/react-query";
import type { Movie } from "../../types/movie";
import { searchMoviesFull, type TMDBSearchResponseFull } from "../../api/tmbd";

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selected, setSelected] = useState<Movie | null>(null);

  const { data, isLoading, isFetching, isError } = useQuery<
    TMDBSearchResponseFull,
    Error
  >({
    queryKey: ["movies", query, page],
    queryFn: () => searchMoviesFull(query, page),
    enabled: !!query,
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });

  const movies = useMemo(() => data?.results ?? [], [data]);
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (query && !isLoading && !isFetching && movies.length === 0 && !isError) {
      toast("No movies found for your request.");
    }
  }, [query, isLoading, isFetching, movies.length, isError]);

  const handleSearch = (q: string) => {
    setSelected(null);
    setQuery(q);
    setPage(1);
  };

  const showLoader = isLoading || isFetching;

  return (
    <div className={styles.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />

      {showLoader ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage />
      ) : (
        <>
          
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={styles.pagination}
              activeClassName={styles.active}
              nextLabel="→"
              previousLabel="←"
            />
              )}
              
              <MovieGrid movies={movies} onSelect={setSelected} />
        </>
      )}

      {selected && (
        <MovieModal movie={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
