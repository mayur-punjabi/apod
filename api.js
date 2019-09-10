//setting explanation below title
let degrees = 5;
let title = document.getElementById("title");
let explanation = document.getElementById("explanation");
let loading = document.getElementById("loading");
let datePicker = document.getElementById("date-picker");
let radians = (degrees * Math.PI) / 180;
let titleWidth = title.offsetWidth;
let titleHeight = titleWidth * Math.tan(radians);
explanation.style.marginTop = titleHeight + "px";

const getNasaData = date => {
  loading.style.display = "block";
  title.textContent = "";
  explanation.textContent = "";

  //getting the APOD title and explanation
  let url = date
    ? `${config.URL}?api_key=${config.api_key}&date=${date}`
    : `${config.URL}?api_key=${config.api_key}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      title.textContent = data.title;
      loading.style.display = "none";
      datePicker.style.display = "none";
      let dataToDisplay = data.msg || data.explanation;
      new Typed("#explanation", {
        strings: [dataToDisplay],
        typeSpeed: 50,
        onComplete: () => {
          document.querySelectorAll(".typed-cursor")[0].style.display = "none";
          datePicker.style.display = "flex";
        }
      });
    })
    .catch(() => {
      loading.style.display = "none";
      new Typed("#explanation", {
        strings: ["Failed to contact NASA."],
        typeSpeed: 50,
        onComplete: () => {
          document.querySelectorAll(".typed-cursor")[0].style.display = "none";
          datePicker.style.display = "flex";
        }
      });
    });
};

getNasaData();

flatpickr("#api-date", {
  dateFormat: "F j, Y",
  defaultDate: "today",
  minDate: "June 16, 1995",
  maxDate: "today",
  onChange: (selectedDates, dateStr, instance) => {
    console.log(selectedDates);
    let day = selectedDates[0].getDate();
    let month = selectedDates[0].getMonth() + 1;
    let year = selectedDates[0].getFullYear();
    let dateToSearch = `${year}-${day}-${month}`;
    getNasaData(dateToSearch);
  }
});
document.getElementById("date-changer").addEventListener("click", () => {
  document.getElementById("api-date").focus();
});
