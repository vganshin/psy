// var gameField = document.getElementById("circle");
var form = document.getElementById("form");
var rules = document.getElementById("rules");
var start_test = document.getElementById("start_test");
var submit = document.getElementById("submit");

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
  numberOfExperiments: [1, 2, 2, 2], // [5, 15, 15, 15],
  waitBeforeRed: [1000, 3000],
  attentionTime: [1000, 1000, 1500, 2000],
  message: ["Тестовая серия", "Основная серия №1", "Основная серия №2", "Основная серия №3"],
};

// ==== Code ===

var gameField = {
  dom: document.getElementById("circle"),
  showGreenCircle: function () {
    this.dom.style.display = "block";
    this.dom.style.background = "green";
    this.dom.textContent = "";
  },
  showRedCircle: function () {
    this.dom.style.display = "block";
    this.dom.style.background = "red";
    this.dom.textContent = "";
  },
  showMessage: function (message) {
    this.dom.style.display = "block";
    this.dom.style.background = "white";
    this.dom.textContent = message;
  }
}

form.style.display = "block";
submit.onclick = () => {
  form.style.display = "none";
  rules.style.display = "block";
}
start_test.onclick = () => {
  rules.style.display = "none";
  prepareExperiment();
}

function prepareExperiment() {
  gameField.showMessage(settings.message[0])
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
  settings.attentionTime.shift();
  settings.numberOfExperiments.shift();
  settings.message.shift();

  // save results

  results = [];
  timer(() => {
    if (settings.message[0]) {
      prepareExperiment();
    } else {
      keypressListener.unset();
      gameField.showMessage("Game Over");
    }
  }, 1000)
  
}

var results = [];

function resolve_space(e) {
  var result = stopWatch.stop();
  timer.clear();
  if (e.charCode === 32 && pressPermission.isAllowedPress) {
    gameField.showMessage(result);
    results.push(result);
    if (results.length % settings.numberOfExperiments[0] === 0) {
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
  var attentionTime = settings.attentionTime[0]; // time
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
