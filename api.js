let degrees = 5;
let title = document.getElementById("title");
let explanation = document.getElementById("explanation");
let loading = document.getElementById("loading");
let datePicker = document.getElementById("date-picker");
let titleAndExplanation = document.querySelector("#title-explanation");
let body = document.body;
let scrollInterval;

const createTitleAndExplanation = () => {
  if (title) {
    title.remove();
  }
  if (explanation) {
    explanation.remove();
  }
  title = document.createElement("h3");
  title.setAttribute("id", "title");
  explanation = document.createElement("p");
  explanation.setAttribute("id", "explanation");
  titleAndExplanation.appendChild(title);
  titleAndExplanation.appendChild(explanation);
  let radians = (degrees * Math.PI) / 180;
  let titleWidth = title.offsetWidth;
  let titleHeight = titleWidth * Math.tan(radians);
  explanation.style.marginTop = titleHeight + "px";
};

const getNasaData = date => {
  loading.style.display = "block";

  createTitleAndExplanation();

  let typedOptions = {
    strings: [],
    typeSpeed: 5,
    showCursor: false,
    onComplete: () => {
      clearInterval(scrollInterval);
    }
  };

  let url = date
    ? `${config.URL}?api_key=${config.api_key}&date=${date}`
    : `${config.URL}?api_key=${config.api_key}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      scrollInterval = setInterval(() => {
        body.scrollTop = body.scrollHeight;
      }, 500);

      title.textContent = data.title;
      loading.style.display = "none";
      let dataToDisplay = data.msg || data.explanation;
      typedOptions.strings = [dataToDisplay];
      new Typed("#explanation", typedOptions);
    })
    .catch(() => {
      loading.style.display = "none";
      typedOptions.strings = ["Failed to contact NASA."];
      new Typed("#explanation", typedOptions);
    });
};

getNasaData();

flatpickr("#api-date", {
  dateFormat: "F j, Y",
  defaultDate: "today",
  minDate: "June 16, 1995",
  maxDate: "today",
  onChange: (selectedDates, dateStr, instance) => {
    let selectedDate = selectedDates[0];
    let day = selectedDate.getDate();
    let month = selectedDate.getMonth() + 1;
    let year = selectedDate.getFullYear();
    let dateToSearch = `${year}-${month}-${day}`;
    getNasaData(dateToSearch);
  }
});
