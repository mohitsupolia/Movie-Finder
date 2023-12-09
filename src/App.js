import { useEffect, useState } from "react";
import "./StarRating";
import StarRating from "./StarRating";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "90b0abaa";

export default function App() {
  // const [query, setQuery] = useState("");

  //const [isOpen1, setIsOpen1] = useState(true);
  // const [isOpen2, setIsOpen2] = useState(true);
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  // const avgUserRating = average(watched.map((movie) => movie.userRating));
  // const avgRuntime = average(watched.map((movie) => movie.runtime));

  // useEffect(function () {
  //   fetch(`http://img.omdbapi.com/?apikey=${KEY}&s=intersellar`)
  //     .then((res) => res.json())
  //     .then((data) => setMovies(data.Search));
  // }, []);
  //const KEY = "90b0abaa";
  //const query = "Guardians of the Galaxy Vol. 2";

  //fetch api print this error
  //const query = "interstellar";

  //useEffect only is used

  /* useEffect(() => {
    //const query = "Guardians of the Galaxy Vol. 2";  

    fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`)
      .then((res) => res.json())
      .then((data) => setMovies(data.Search))
      .catch((error) => console.error("error", error));
  }, []); // Empty dependency array means it runs once when the component mounts*/

  function handleSelectedMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  //store the watched movie in array
  function handledWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handledeleteWatchedMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbId !== id));
  }
  // Escape closing
  useEffect(function () {
    document.addEventListener("keydown", function (e) {
      if (e.code === "Escape") {
        handleCloseMovie();
        console.log("CLOSING");
      }
    });
  }, []); // Empty dependency array means the effect runs once when the component mounts

  //use async function

  useEffect(
    function () {
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
      handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return (
    <>
      <Navbar query={query} setQuery={setQuery}>
        <Result movies={movies} />
      </Navbar>

      <main className="main">
        <Box
          element={
            isLoading ? (
              <Loader />
            ) : !isLoading && !error ? (
              <MovieList movies={movies} onSelectMovie={handleSelectedMovie} />
            ) : (
              <ErrorMessage message={error} />
            )
          }
        />

        <Box
          element={
            selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                onCloseMovie={handleCloseMovie}
                onAddWatched={handledWatchedMovie}
                watched={watched}
              ></MovieDetails>
            ) : (
              <>
                <WatchedSummary watched={watched} />
                <WatchedList
                  watched={watched}
                  onDeleteWatched={handledeleteWatchedMovie}
                />
              </>
            )
          }
        />
        {/* <Box>
          <MovieList movies={movies} />
        </Box> */}
        {/* <Box>
          <WatchedSummary watched={watched} />
          <WatchedList watched={watched} />
        </Box> */}
      </main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>😍😍</span>
      {message}
    </p>
  );
}
function Navbar({ children, query, setQuery }) {
  // const [query, setQuery] = useState("");
  // const [movies, setMovies] = useState(tempMovieData);
  return (
    <nav className="nav-bar">
      <Logo />
      <Search query={query} setQuery={setQuery} />
      {children}
    </nav>
  );
}
function Search({ query, setQuery }) {
  //const [query, setQuery] = useState("");
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>Movie Finder</h1>
    </div>
  );
}

// function Result({ movies }) {
//   return (
//     <p className="num-results">
//       Found <strong>{movies.length}</strong> results
//     </p>
//   );
// }

//updating result function
function Result({ movies }) {
  // Provide a default empty array if movies is falsy
  const movieList = movies ?? [];

  return (
    <p className="num-results">
      Found <strong>{movieList.length}</strong> results
    </p>
  );
}

function Box({ element }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && element}
    </div>
  );
}

// function WatchedBox() {
//   const [isOpen2, setIsOpen2] = useState(true);
//   const [watched, setWatched] = useState(tempWatchedData);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }
function MovieList({ movies, onSelectMovie }) {
  // const [movies, setMovies] = useState(tempMovieData);

  if (!Array.isArray(movies)) {
    // Handle the case where movies is not an array, e.g., show an error message.
    return <p>Error: Movies data is not available.</p>;
  }

  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}
function Movie({ movie, onSelectMovie }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const isWatched = watched.map((movie) => movie.imdbId).includes(selectedId);
  console.log(isWatched);

  const watchedRating = watched.find(
    (movie) => movie.imdbId === selectedId
  )?.userRating;
  console.log(watchedRating);
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  //console.log(title, year);

  function handleAdd() {
    const newWatchedMovie = {
      imdbId: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    //console.log("hi");
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }
  useEffect(
    function () {
      function callBack(e) {
        if (e.code === "Escape") {
          console.log("Escape key pressed");
          onCloseMovie();
        }
      }
      document.addEventListener("keydown", callBack);
      return function () {
        document.removeEventListener("keydown", callBack);
      };
    },
    [onCloseMovie]
  );

  useEffect(
    function () {
      async function getMovieDetails() {
        setLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        console.log(data);
        setMovie(data);
        setLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie| ${title}`;

      return function () {
        document.title = "usePopCorn";
        console.log(`Movie of title is ${title}`);
      };
    },
    [title]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released}&bull;{runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      Add to the list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated with movie {watchedRating} <span>⭐</span>
                </p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbIDclear}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbId)}
        >
          X
        </button>
      </div>
    </li>
  );
}
