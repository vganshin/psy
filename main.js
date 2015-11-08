var gameField = document.getElementById("circle");
var form = document.getElementById("form");
var rules = document.getElementById("rules");
var start_test = document.getElementById("start_test");
var submit = document.getElementById("submit");

// === Settings ===

var settings = {
  numberOfExperiments: [1, 2, 2, 2], // [5, 15, 15, 15],
  waitBeforeRed: [1000, 3000],
  attentionTime: [1000, 1000, 1500, 2000],
  message: ["test", "1", "2", "3"],
};

// ==== Code ===

form.style.display = "block";
submit.onclick = () => {
  // save user
  form.style.display = "none";
  rules.style.display = "block";
}
start_test.onclick = () => {
  rules.style.display = "none";
  gameField.style.display = "block";
  gameField.textContent = settings.message[0];
  timer(() => showExperiment(), 1000);
}

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

var results = [];

var isAllowedPress;

var hello;

addEventListener("keypress", e => {
  var result = stopWatch.stop();
  gameField.style.background = "white";
  timer.clear();
  if (e.charCode === 32 && isAllowedPress) {
    saveResult(result);
  } else {
    gameField.textContent = "Error";
    showExperiment();
  }
});

function saveResult(result) {
  gameField.textContent = result;
  results.push(result)
  if (results.length % settings.numberOfExperiments[0] === 0) {
    settings.attentionTime.shift();
    settings.numberOfExperiments.shift();
    settings.message.shift();
    gameField.style.display = "block";
    gameField.textContent = settings.message[0];
    timer(() => showExperiment(), 1000);
  } else {
    showExperiment();
  }
}

function showExperiment() {
  var attentionTime = settings.attentionTime[0];
  var waitBeforeRed = settings.waitBeforeRed;
  
  if (!attentionTime) {
    timer(() => gameField.textContent = "Game over!", 1000);
    return;
  }
  
  gameField.style.display = "block";  
  
  isAllowedPress = false;
  
  function showAttention() {
    gameField.textContent = "Внимание";
    gameField.style.background = "white";
    timer(() => showGreenCircle(), attentionTime);
  }
  
  function showGreenCircle() {
    gameField.textContent = "";
    gameField.style.background = "green";
    var time = nrand.apply(null, waitBeforeRed);
    timer(() => showRedCircle(), time);
  }
  
  function showRedCircle() {
    stopWatch.start();
    isAllowedPress = true;
    gameField.textContent = "";
    gameField.style.background = "red";
  }
  
  return timer(() => showAttention(), 1000);
}
