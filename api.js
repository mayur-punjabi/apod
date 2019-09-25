// for styling the explanation
let degrees = 5;

//getting the elements
const typingElementID = "explanation";
const title = document.getElementById("title");
const explanation = document.getElementById(typingElementID);
const loading = document.getElementById("loading");
const datePicker = document.getElementById("date-picker");
const body = document.body;

//inerval for automatic scrolling
let scrollInterval;

//typing variale and options
let typed = undefined;
const typedOptions = {
  strings: [],
  typeSpeed: 50,
  showCursor: false,
  onComplete: () => {
    //stoppting scrolling after typed
    clearInterval(scrollInterval);
  }
};

//moving explanation below title because of skew on title
const styleTitle = () => {
  title.textContent = "";
  const radians = (degrees * Math.PI) / 180;
  const titleWidth = title.offsetWidth;
  const titleHeight = titleWidth * Math.tan(radians);
  explanation.style.marginTop = titleHeight + "px";
};

//getting the title and explanation of the specified data
const getNasaData = date => {
  //showing the loading
  loading.style.display = "block";

  //moving the explanation down
  styleTitle();

  //getting today's data if no date is provided
  let url = date
    ? `${config.URL}?api_key=${config.api_key}&date=${date}`
    : `${config.URL}?api_key=${config.api_key}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      //starting scroll
      scrollInterval = setInterval(() => {
        body.scrollTop = body.scrollHeight;
      }, 500);

      //showing title and hiding loading
      title.textContent = data.title;
      loading.style.display = "none";

      //typing the explanation
      let dataToDisplay = data.msg || data.explanation;
      typedOptions.strings = [dataToDisplay];
      typed = new Typed(`#${typingElementID}`, typedOptions);
    })
    .catch(() => {
      loading.style.display = "none";
      typedOptions.strings = ["Failed to contact NASA."];
      typed = new Typed(`#${typingElementID}`, typedOptions);
    });
};

//calling for today's date
getNasaData();

//date picker
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

    //reseting typed js object
    if (typed && typed.constructor === Typed) typed.destroy();

    //getting and showing the data of dateToSearch
    getNasaData(dateToSearch);
  }
});
