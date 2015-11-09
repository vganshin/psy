// var gameField = document.getElementById("circle");
var form = document.getElementById("form");
var rules = document.getElementById("rules");
var start_test = document.getElementById("start_test");
var submit = document.getElementById("submit");

var user = {
  results: [],
  date: new Date(),
};

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

// ==== Code ===

var gameField = {
  dom: document.getElementById("circle"),
  message: document.getElementById("message"),
  showGreenCircle: function () {
    this.dom.style.display = "block";
    this.message.style.display = "none";
    this.dom.style.background = "rgb(19, 199, 42)";
    this.dom.textContent = "";
  },
  showRedCircle: function () {
    this.dom.style.display = "block";
    this.dom.style.background = "rgb(246, 46, 46)";
    this.dom.textContent = "";
  },
  showMessage: function (message) {
    this.dom.style.display = "none";
    this.message.style.display = "flex";
    this.message.textContent = message;
  }
}

var consultant = {
  dom: document.getElementById("consultant"),
  showMessage: function (text) {
    this.dom.style.display = "flex";
    this.dom.textContent = text;
  },
  hide: function () {
    this.dom.style.display = "none";
  } 
}

form.style.display = "flex";
submit.onclick = () => {
  user.name = form.name.value;
  user.sport_type = form.sport_type.value;

  form.style.display = "none";
  rules.style.display = "flex";
}
start_test.onclick = () => {
  rules.style.display = "none";
  user.toDelete = settings.series[0].number;
  prepareExperiment();
}

function prepareExperiment() {
  gameField.showMessage(settings.series[0].message)
  consultant.showMessage("Нажмите пробел");
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
      saveResults();
    }
  }, 1000)
}

function saveResults() {
  window.user = user;
  var results = user.results.map((result) => `${user.name},${user.sport_type},${result}`).join("\n");
  var fs = require('fs');
  if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
  }
  fs.writeFile(`data/${new Date()}`, results);
}

var results = [];

function resolve_space(e) {
  var result = stopWatch.stop();
  timer.clear();
  if (e.charCode === 32 && pressPermission.isAllowedPress) {
    pressPermission.diallowPress();
    results.push(result);
    gameField.showMessage(result);
    consultant.showMessage(`${results.length} из ${settings.series[0].number}`);
    if (results.length % settings.series[0].number === 0) {
      endExperiment();
    } else {
      timer(() => showExperiment(), 1000);
    }
  } else {
    gameField.showMessage("Error");
    consultant.showMessage(`${results.length} из ${settings.series[0].number}`);
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
  
  consultant.showMessage("");
  gameField.showMessage("");
  return timer(() => showAttention(), 1000);
}
