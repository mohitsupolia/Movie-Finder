import { useState, useEffect } from "react";

const KEY = "90b0abaa";
export function useMovies(query, callBack) {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);
  useEffect(
    function () {
      callBack?.();
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setLoading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong to fetch movie loading");

          const data = await res.json();
          if (data.Response === "False") throw new Error("NO Movie is found");
          setMovies(data.Search);

          setLoading(false);
        } catch (err) {
          console.error(err.message);
          if (err.name !== "AbortError") setError(err.message);
        } finally {
          setLoading(false);
        }
      }
      if (!query.length) {
        setMovies([]);
        setError("");
        setLoading(false);
        return;
      }
      //   handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
