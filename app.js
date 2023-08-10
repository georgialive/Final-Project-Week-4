let movies = [];
const searchInput = document.querySelector('#searchInput');
const slider = document.getElementById("myRange");
const output = document.getElementById("thumbValue");
const moviesWrapper = document.querySelector('.movies');
let moviesData = {};

async function getMovies(searchTerm) {
  const response = await fetch(`https://www.omdbapi.com/?&apikey=20f3288f&s=${searchInput}`);
  return await response.json();
}

// async function searchMovies(searchInput) {
//   moviesData = await getMovies(searchInput);
//   renderMovies();
// }

// Commenting out the duplicate searchMovies function

  function setupSlider() {
    output.innerHTML = slider.value;
    const thumbWidth = 25;
  
    slider.oninput = function() {
      output.innerHTML = this.value;
      let percentage = (this.value - this.min) / (this.max - this.min) * 100;
      this.style.background = `linear-gradient(to right, #d3d3d3 ${percentage}%, #400A14 ${percentage}%)`;
      output.style.left = `calc(${percentage}% - (${thumbWidth}px / 2))`;
      output.innerHTML = `%${slider.value}`;
  
      renderMovies();
    };
    slider.oninput();
  }


async function renderMovies() {
    const moviesWrapper = document.querySelector('.movies');
    moviesWrapper.classList.add('movies__loading');
    moviesWrapper.innerHTML = '';

    if (moviesData.Search) {
      moviesWrapper.innerHTML = moviesData.Search.map((movie) =>
        movieHTML(movie)
      ).join("");
    }
  
    moviesWrapper.classList.remove("movies__loading");
}

async function searchMovies() {
  const searchTerm = searchInput.value;
  moviesData = await getMovies(searchTerm);
  renderMovies();
}

// function filterMovies(event) {
//     renderMovies(event.target.value);
// }

// Commented out the unused filterMovies function

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

function movieHTML(movie) {
  return `
    <div class="movie">
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