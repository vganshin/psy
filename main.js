// var gameField = document.getElementById("circle");
var form = document.getElementById("form");
var rules = document.getElementById("rules");
var start_test = document.getElementById("start_test");
var submit = document.getElementById("submit");
var consultant = document.getElementById("consultant");

var user = {
  results: [],
  date: new Date(),
};

// == Functions ===

var stopWatch = {
  getTime: function () {
    return +new Date()
  },
  start: function () {
    this.startTime = this.getTime();
  },
  stop: function () {
    return this.getTime() - this.startTime;
  },
};

var pressPermission = {
  isAllowedPress: false,
  allowPress: function () { this.isAllowedPress = true; },
  diallowPress: function () { this.isAllowedPress = false; },
};

function timer(callback, delay) {
  timer.clear();
  timer.current = setTimeout(callback, delay);
};
timer.clear = () => clearTimeout(timer.current);

var nrand = (a, b) => Math.round(a + Math.random() * (b - a));

function keypressListener(handler) {
  keypressListener.unset();
  keypressListener.handler = handler;
  addEventListener("keypress", keypressListener.handler)
}
keypressListener.unset = () => removeEventListener("keypress", keypressListener.handler);

// === Settings ===

var settings = {
  waitBeforeRed: [1000, 3000],
  series: [
    {
      number: 1,
      attentionTime: 1000,
      message: "Тестовая серия"
    },
    {
      number: 2,
      attentionTime: 1000,
      message: "Основная серия №1"
    },
    {
      number: 2,
      attentionTime: 1500,
      message: "Основная серия №2"
    },
    {
      number: 2,
      attentionTime: 2000,
      message: "Основная серия №3"
    },
  ]
};

// ==== Code ===

var gameField = {
  dom: document.getElementById("circle"),
  showGreenCircle: function () {
    this.dom.style.display = "block";
    this.dom.style.background = "rgb(19, 199, 42)"; // "green";
    this.dom.textContent = "";
  },
  showRedCircle: function () {
    this.dom.style.display = "block";
    this.dom.style.background = "rgb(246, 46, 46)"; // "red";
    this.dom.textContent = "";
  },
  showMessage: function (message) {
    this.dom.style.display = "block";
    this.dom.style.background =  "#f2f2f2"; //"white";
    this.dom.textContent = message;
  }
}

form.style.display = "block";
submit.onclick = () => {
  // save user info
  form.style.display = "none";
  rules.style.display = "block";
}
start_test.onclick = () => {
  rules.style.display = "none";
  user.toDelete = settings.series[0].number;
  prepareExperiment();
}

function prepareExperiment() {
  gameField.showMessage(settings.series[0].message)
  keypressListener((e) => {
    if (e.charCode === 32) {
      startExperiment();
    }
  })
}

function startExperiment() {
  keypressListener(resolve_space);
  showExperiment();
}

function endExperiment() {
  settings.series.shift();

  user.results.push(...results);

  results = [];
  timer(() => {
    if (settings.series[0]) {
      prepareExperiment();
    } else {
      keypressListener.unset();
      gameField.showMessage("Game Over");
      user.results = user.results.slice(user.toDelete);
      console.log(user.results);
    }
  }, 1000)
  
}

var results = [];

function resolve_space(e) {
  var result = stopWatch.stop();
  timer.clear();
  if (e.charCode === 32 && pressPermission.isAllowedPress) {
    pressPermission.diallowPress();
    gameField.showMessage(result);
    results.push(result);
    if (results.length % settings.series[0].number === 0) {
      endExperiment();
    } else {
      timer(() => showExperiment(), 1000);
    }
  } else {
    gameField.showMessage("Error");
    timer(() => showExperiment(), 1000);
  }
};

function showExperiment() {
  var attentionTime = settings.series[0].attentionTime; // time
  var waitBeforeRed = settings.waitBeforeRed;
  
  pressPermission.diallowPress();

  function showAttention() {
    gameField.showMessage("Внимание");
    timer(() => showGreenCircle(), attentionTime);
  }
  
  function showGreenCircle() {
    gameField.showGreenCircle();
    var time = nrand.apply(null, waitBeforeRed);
    timer(() => showRedCircle(), time);
  }
  
  function showRedCircle() {
    stopWatch.start();
    pressPermission.allowPress();
    gameField.showRedCircle();
  }
  
  gameField.showMessage("");
  return timer(() => showAttention(), 1000);
}
