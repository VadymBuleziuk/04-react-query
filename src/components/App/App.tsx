import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import { useState } from "react";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { fetchMovies } from "../../services/movieService";

function App() {
  const [collection, setCollection] = useState<Movie[]>([]);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<boolean>(false);
  const token = import.meta.env.VITE_TMDB_TOKEN;
  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => setSelectedMovie(null);
  const handleSubmit = async (query: string) => {
    setShowLoader(true);
    setError(false);

    try {
      const movies = await fetchMovies(query, token);

      if (movies.length === 0) {
        toast.error("No movies found for your request.");
        setCollection([]);
        return;
      }

      setCollection(movies);
    } catch {
      setError(true);
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSubmit} />
      {error ? (
        <ErrorMessage />
      ) : (
        <MovieGrid movies={collection} onSelect={openModal} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
      {showLoader && <Loader />}
    </div>
  );
}

export default App;
