const slider = document.getElementById("myRange");
const output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value
const thumbWidth = 25; // adjust this to the actual width of your thumb

slider.oninput = function() {
  output.innerHTML = this.value;
  let percentage = (this.value - this.min) / (this.max - this.min) * 100;
  this.style.background = `linear-gradient(to right, #d3d3d3 ${percentage}%, #400A14 ${percentage}%)`;
  output.style.left = `calc(${percentage}% - (25px / 2))`;
  output.innerHTML = `%${slider.value}`;
}

slider.addEventListener('input', slider.oninput);

slider.oninput();

// Set color on page load
setColor(slider);

function move(event) {

    const elem = document.getElementById("myBar");
    const width = 1;
    const id = setInterval(frame, 10);
   
    function frame() {
      if (width >= 100) {
        clearInterval(id);
      } else {
        width++;
        elem.style.width = width + '%';
      }
    }

}

move(event)