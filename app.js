const slider = document.getElementById("myRange");
const output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
  let percentage = (this.value - this.min) / (this.max - this.min) * 100;
  this.style.background = `linear-gradient(to right, #d3d3d3 ${percentage}%, #400A14 ${percentage}%)`;
}

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