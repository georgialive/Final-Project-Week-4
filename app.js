let movies = [];
let form = document.querySelector('.form');
let searchInput = document.querySelector('#searchInput').value;
const slider = document.getElementById("myRange");
const output = document.getElementById("thumbValue");
const moviesContainer = document.getElementById("moviesContainer");


async function getMovies() {
  const searchInput = document.getElementById("searchInput").value;
  const response = await fetch(`https://www.omdbapi.com/?t=${searchInput || `fast`}&apikey=20f3288f`);
  const movieData = await response.json();
  return movieData.Search;
}

getMovies()
  .then(data => {
    movies = data; // Store the movies data
    renderMovies(); // Call renderMovies instead of renderMovie
  })
  .catch(error => console.error('Error:', error));


output.innerHTML = slider.value;
const thumbWidth = 25;

slider.oninput = function() {
  output.innerHTML = this.value;
  let percentage = (this.value - this.min) / (this.max - this.min) * 100;
  this.style.background = `linear-gradient(to right, #d3d3d3 ${percentage}%, #400A14 ${percentage}%)`;
  output.style.left = `calc(${percentage}% - (${thumbWidth}px / 2))`;
  output.innerHTML = `%${slider.value}`;

  renderMovies();
}

slider.addEventListener('input', slider.oninput);

slider.oninput();


async function renderMovies(filter) {
    const moviesWrapper = document.querySelector('.movies');
    moviesWrapper.classList.add('movies__loading');
    moviesWrapper.classList.remove('movies__loading');

    const filteredMovies = movies.filter(movie => {
      let ratingsArray = Array.isArray(movie.Ratings) ? movie.Ratings : transformRatings(movie.Ratings);
      let average = averageRating(ratingsArray);
      return average >= slider.value;
    });

    const moviesHTML = filteredMovies.map((movie) => {
        return `<div class="movie">
            <figure class="movie__img--wrapper">
                <img class="movie__img" src="${movie.Poster}" alt="">
            </figure>
            <div class="movie__title">
                ${movie.Title}
            </div>
            <div class="movie__ratings">
                ${ratingsHTML(averageRating(movie.Ratings))}
            </div>
        </div>`;
    }).join("");

    moviesWrapper.innerHTML = moviesHTML;
}

function searchMovies() {
  const searchInput = document.querySelector('#searchInput').value;
  movies = movies.filter(movie => movie.Title.includes(searchInput));
  renderMovies();
}

function transformRatings(ratingsObject) {
  return Object.entries(ratingsObject).map(([source, value]) => {
      return { Source: source, Value: value };
  });
}

function averageRating(ratingsObject) {
  let ratings = transformRatings(ratingsObject);
  let totalRating = 0;

  ratings.forEach(rating => {
      if(rating.Source === "Internet Movie Database"){
          totalRating += parseFloat(rating.Value.split("/")[0]);
      } else if(rating.Source === "Rotten Tomatoes" || rating.Source === "Metacritic"){
          totalRating += parseFloat(rating.Value.replace("%","")) / 10;
      }
  });

  return totalRating / ratings.length;
}

function ratingsHTML(rating) {
    let ratingHTML = '';
    for (let i = 0; i < Math.floor(rating); ++i) {
        ratingHTML += '<i class="fas fa-star"></i>\n';
    }
    if (!Number.isInteger(rating)) {
        ratingHTML += '<i class="fas fa-star-half-alt"></i>\n';
    }
    return ratingHTML;
}

function filterMovies(event) {
    renderMovies(event.target.value);
}

setTimeout(() => {
    renderMovies();
});

