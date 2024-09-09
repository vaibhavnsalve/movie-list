const API_KEY = '55957a08cc0590dd3903cbb069456396'; // Replace with your TMDb API key
const BASE_URL = 'https://api.themoviedb.org/3';
let year = 2012;  // Starting year
let page = 1;     // Start from page 1
let selectedGenres = []; // Array to store selected genres

document.addEventListener('DOMContentLoaded', () => {
  fetchGenres();
  loadMovies();

  // Add infinite scrolling behavior
  window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      loadMoreMovies();
    }
  });
});

// Fetch genres and display them as filter buttons
const fetchGenres = async () => {
  const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  displayGenres(data.genres);
};

// Display genres as buttons
const displayGenres = (genres) => {
  const genreContainer = document.getElementById('genre-filter-container');
  genres.forEach(genre => {
    const button = document.createElement('button');
    button.classList.add('genre-button');
    button.innerText = genre.name;
    button.addEventListener('click', () => {
      toggleGenreSelection(genre.id);
      loadMovies(true); // Reload movies when a genre is selected/deselected
    });
    genreContainer.appendChild(button);
  });
};

// Toggle genre selection
const toggleGenreSelection = (genreId) => {
  if (selectedGenres.includes(genreId)) {
    selectedGenres = selectedGenres.filter(id => id !== genreId);
  } else {
    selectedGenres.push(genreId);
  }
};

// Fetch and display movies
const loadMovies = async (clear = false) => {
  if (clear) {
    document.getElementById('movie-list').innerHTML = ''; // Clear movies if genre changes
    page = 1; // Reset page
  }

  const genreParam = selectedGenres.length > 0 ? `&with_genres=${selectedGenres.join(',')}` : '';
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&primary_release_year=${year}&vote_count.gte=100&page=${page}${genreParam}`;
  
  document.getElementById('loading').classList.remove('hidden'); // Show loading
  const response = await fetch(url);
  const data = await response.json();
  
  displayMovies(data.results);
  document.getElementById('loading').classList.add('hidden'); // Hide loading
};

// Display movies on the page
const displayMovies = (movies) => {
  const movieList = document.getElementById('movie-list');
  
  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');

    const moviePoster = document.createElement('img');
    moviePoster.classList.add('movie-poster');
    moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    moviePoster.alt = movie.title;

    const movieDetails = document.createElement('div');
    movieDetails.classList.add('movie-details');

    const movieTitle = document.createElement('h3');
    movieTitle.innerText = movie.title;

    const movieOverview = document.createElement('p');
    movieOverview.innerText = `${movie.overview.slice(0, 100)}...`;

    movieDetails.appendChild(movieTitle);
    movieDetails.appendChild(movieOverview);
    movieCard.appendChild(moviePoster);
    movieCard.appendChild(movieDetails);
    movieList.appendChild(movieCard);
  });
};

// Load more movies on scroll (increment page)
const loadMoreMovies = () => {
  page++;
  loadMovies();
};
