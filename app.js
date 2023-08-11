// DOM ELEMENTS
const searchInput = document.querySelector("#searchInput");
const slider = document.getElementById("myRange");
const output = document.getElementById("thumbValue");
const moviesWrapper = document.querySelector(".movies");
const loadingIndicator = document.querySelector('.loading-indicator');

// VARIABLES
let movies = [];
let moviesData = {};
let currentPage = 1;
let totalResults = 0;

//  FETCH MOVIES FROM API
async function getMovies(searchInput, page = 1) {
  const response = await fetch(`https://www.omdbapi.com/?&apikey=20f3288f&s=${searchInput || "fast"}&page=${page}`);
  const data = await response.json();
  totalResults = data.totalResults ? parseInt(data.totalResults) : 0;
  return data;
}

//  RENDER MOVIES
async function renderMovies(append = false) {
  moviesWrapper.classList.add("movies__loading");

  if (!append) moviesWrapper.innerHTML = ""; // Clear if it's not an appending action

  moviesData = await getMovies(searchInput.value, currentPage);

  if (moviesData.Search) {
    moviesWrapper.innerHTML += moviesData.Search.map(movie => movieHTML(movie)).join(""); // Append new movies to existing ones
  }

  moviesWrapper.classList.remove("movies__loading");
}

// SEARCH MOVIES
async function searchMovies() {
  moviesData = await getMovies(searchInput.value);
  renderMovies();
}

// GENERATE HTML FOR MOVIE
function movieHTML(movie) {
  return `<div class="movie">
            <figure class="movie__img--wrapper">
              <img class="movie__img" src="${movie.Poster}" alt="">
            </figure>
            <div class="movie__title">
              ${movie.Title}
            </div>
          </div>`;
}

// SLIDER SETUP & LOGIC
function setupSlider() {
  output.innerHTML = slider.value;
  const thumbWidth = 25;

  // In the future I would want to make the slider functional, 
  // so that it filters by rating of the movie, but unfortunately 
  // with the approach I was thinking of, for each movie in the Search results,
  // I was making a separate API call to fetch its details. 
  // This slowed down the rendering process because of the wait time 
  // for each API call to complete.


  slider.oninput = function() {
    output.innerHTML = this.value;
    const percentage = ((this.value - this.min) / (this.max - this.min)) * 100;
    this.style.background = `linear-gradient(to right, #d3d3d3 ${percentage}%, #400A14 ${percentage}%)`;
    output.style.left = `calc(${percentage}% - (${thumbWidth}px / 2))`;
    output.innerHTML = `%${slider.value}`;
    renderMovies();
  };

  slider.oninput(); // Trigger once to set initial conditions
}

// INFINITE SCROLLING LOGIC
window.addEventListener('scroll', async () => {
  const loadedMovies = moviesWrapper.querySelectorAll('.movie').length;
  if (loadedMovies < totalResults && window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    loadingIndicator.style.display = 'block'; // Show loader
    currentPage++;
    await renderMovies(true);
    loadingIndicator.style.display = 'none'; // Hide loader after loading
  }
});

// INITIALIZATION
setupSlider();

setTimeout(() => {
  searchMovies(); // Call searchMovies instead of renderMovies to get initial data
}, 1000);
