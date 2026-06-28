import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import { useEffect, useState } from "react";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { fetchMovies } from "../../services/movieService";
import type { MoviesResponse } from "../../services/movieService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Pagination from "../Pagination/Pagination";

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => setSelectedMovie(null);

  const handleSubmit = (query: string) => {
    setQuery(query);
    setPage(1);
  };
  const { data, isLoading, isError } = useQuery<MoviesResponse>({
    queryKey: ["movie", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });
  useEffect(() => {
    if (data?.results?.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data]);
  console.log(data);

  return (
    <div className={css.app}>
      <Toaster position="top-center" />

      <SearchBar onSubmit={handleSubmit} />
      {isError ? (
        <ErrorMessage />
      ) : (
        <MovieGrid movies={data?.results ?? []} onSelect={openModal} />
      )}
      {data && data.total_pages > 1 && (
        <Pagination
          totalPages={data.total_pages}
          page={page}
          setPage={setPage}
        />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
      {isLoading && <Loader />}
    </div>
  );
}

export default App;
