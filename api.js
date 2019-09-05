//setting explanation below title
let degrees = 5;
let title = document.getElementById("title");
let explanation = document.getElementById("explanation");
let loading = document.getElementById("loading");
let radians = (degrees * Math.PI) / 180;
let titleWidth = title.offsetWidth;
let titleHeight = titleWidth * Math.tan(radians);
explanation.style.marginTop = titleHeight + "px";

//getting the APOD title and explanation
fetch(`${config.URL}?api_key=${config.api_key}`)
  .then(response => response.json())
  .then(data => {
    title.textContent = data.title;
    loading.style.display = "none";
    let typed = new Typed("#explanation", {
      strings: [data.explanation],
      typeSpeed: 30
    });
  })
  .catch(error => console.trace(error));
