let movies = [];
const slider = document.getElementById("myRange");
const output = document.getElementById("demo");
const searchInput = document.getElementById("searchInput");
const moviesContainer = document.getElementById("moviesContainer");

output.innerHTML = slider.value;
const thumbWidth = 25;

slider.oninput = function() {
  output.innerHTML = this.value;
  let percentage = (this.value - this.min) / (this.max - this.min) * 100;
  this.style.background = `linear-gradient(to right, #d3d3d3 ${percentage}%, #400A14 ${percentage}%)`;
  output.style.left = `calc(${percentage}% - (${thumbWidth}px / 2))`;
  output.innerHTML = `%${slider.value}`;
  searchMovies();
}

slider.addEventListener('input', slider.oninput);

slider.oninput();

async function searchMovies() {
    const response = await fetch(`https://www.omdbapi.com/?apikey=20f3288f&s=${searchInput.value}`);
    const data = await response.json();
    movies = data.Search;
    displayMovies();
}

function displayMovies() {
  const sliderValue = slider.value / 100;

  const filteredMovies = movies.filter(movie => {
      const avgRating = movie.Ratings.reduce((acc, curr) => {
          // Check if rating is in percentage
          if (curr.Value.includes('%')) {
              return acc + parseFloat(curr.Value) / 10; // Convert percentage to 0-10 scale
          } else {
              return acc + parseFloat(curr.Value.split('/')[0]);
          }
      }, 0) / movie.Ratings.length;

      return avgRating / 10 >= sliderValue; // Convert rating to a 0-1 scale
  });

  const htmlString = filteredMovies.map((movie) => {
      return `
          <div class="card">
              <img class="card__img" src="${movie.Poster}" alt="${movie.Title}">
              <h2 class="card__title">${movie.Title} (${movie.Year})</h2>
              <p class="card__rating">Rating: ${movie.imdbRating}/10</p>
          </div>
      `;
  }).join('');

  moviesContainer.innerHTML = htmlString;
}

async function getMovieDetails(imdbID) {
  const response = await fetch(`https://www.omdbapi.com/?apikey=20f3288f&i=${imdbID}`);
  const data = await response.json();
  return data;
}

async function searchMovies() {
  const response = await fetch(`https://www.omdbapi.com/?apikey=20f3288f&s=${searchInput.value}`);
  const data = await response.json();
  if (data.Search && Array.isArray(data.Search)) {
      movies = await Promise.all(data.Search.map(movie => getMovieDetails(movie.imdbID)));
      displayMovies();
  } else {
      console.error('Invalid data:', data);
      moviesContainer.innerHTML = 'No movies found.';
  }
}

