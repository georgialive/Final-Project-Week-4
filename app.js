const searchInput = document.querySelector("#searchInput");
const slider = document.getElementById("myRange");
const output = document.getElementById("thumbValue");
const moviesWrapper = document.querySelector(".movies");
let movies = [];
let moviesData = {};
let currentPage = 1;
let totalResults = 0;

async function getMovies(searchInput, page = 1) {
  const response = await fetch(
    `https://www.omdbapi.com/?&apikey=20f3288f&s=${
      searchInput || "fast"
    }&page=${page}`
  );
  const data = await response.json();
  totalResults = data.totalResults ? parseInt(data.totalResults) : 0;
  return data;
}

window.addEventListener('scroll', async () => {
  const loadedMovies = moviesWrapper.querySelectorAll('.movie').length;
  if (loadedMovies < totalResults && window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
      document.querySelector('.loading-indicator').style.display = 'block'; // Show the loader
      currentPage++;
      await renderMovies(true);
      document.querySelector('.loading-indicator').style.display = 'none'; // Hide the loader after movies are loaded
  }
});


function setupSlider() {
  output.innerHTML = slider.value;
  const thumbWidth = 25;

  slider.oninput = function () {
    output.innerHTML = this.value;
    let percentage = ((this.value - this.min) / (this.max - this.min)) * 100;
    this.style.background = `linear-gradient(to right, #d3d3d3 ${percentage}%, #400A14 ${percentage}%)`;
    output.style.left = `calc(${percentage}% - (${thumbWidth}px / 2))`;
    output.innerHTML = `%${slider.value}`;

    renderMovies();
  };
  slider.oninput();
}

// In the future I would want to make the slider functional, 
// so that it filters by rating of the movie, but unfortunately the API 
// I used doesn't have ratings section I don't think


async function renderMovies(append = false) {
  moviesWrapper.classList.add("movies__loading");

  if (!append) {
    moviesWrapper.innerHTML = ""; // Clear if it's not an appending action
  }

  moviesData = await getMovies(searchInput.value, currentPage);

  if (moviesData.Search) {
    moviesWrapper.innerHTML += moviesData.Search.map((movie) =>
      movieHTML(movie)
    ).join(""); // Append new movies to existing ones
  }

  moviesWrapper.classList.remove("movies__loading");
}

async function searchMovies() {
  const searchTerm = searchInput.value;
  moviesData = await getMovies(searchTerm);
  renderMovies();
}

window.addEventListener('scroll', async () => {
  const loadedMovies = moviesWrapper.querySelectorAll('.movie').length;
  if (loadedMovies < totalResults && window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
      currentPage++;
      await renderMovies(true);
  }
});

// function filterMovies(event) {
//     renderMovies(event.target.value);
// }

// Commented out the unused filterMovies function

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

setTimeout(() => {
  searchMovies(); // Call searchMovies instead of renderMovies to get initial data
}, 1000);

setupSlider();
