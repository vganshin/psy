// var gameField = document.getElementById("circle");
var form = document.getElementById("form");
var rules = document.getElementById("rules");
var start_test = document.getElementById("start_test");
var submit = document.getElementById("submit");

// === Settings ===

var settings = {
  numberOfExperiments: [1, 2, 2, 2], // [5, 15, 15, 15],
  waitBeforeRed: [1000, 3000],
  attentionTime: [1000, 1000, 1500, 2000],
  message: ["Тестовая серия", "Основная серия №1", "Основная серия №2", "Основная серия №3"],
};

// ==== Code ===

var globalState = {
  REGISTRATION: "REGISTRATION",
  SHOW_RULES: "SHOW_RULES",
  TEST: "TEST",
  EXPERIMENT: "EXPERIMENT",
  SETTINGS: "SETTINGS",
  END: "END",

  state: null,
  setState: function (state) { this.state = state; resolveGlobalState(); },
  resolve: function () {
    switch (state.global) {
      case globalState.REGISTRATION:
        form.style.display = "block";

        this.next = function () { this.setState(globalState.SHOW_RULES); };
        break;
      case globalState.SHOW_RULES:
        // save user
        form.style.display = "none";
        rules.style.display = "block";

        this.next = function () { this.setState(globalState.TEST); };
        break;
      case globalState.TEST:
        rules.style.display = "none";
        gameField.showMessage(settings.message[0]);
        seriesState.start();

        this.next = function () { this.setState(globalState.EXPERIMENT); };
        break;
      case globalState.EXPERIMENT:

        break;
      case globalState.SETTINGS:

        break;
      case globalState.END:

        break;
    }
  },
  next: function () {},
}

var experimentState = {
  state: experimentState.PREPARE,
  setState: function (state) { this.state = state; resolveExperimentState(); },
  PREPARE: "PREPARE",
  ALLOW_PRESS: "ALLOW_PRESS",
  END_EXPERIMENT: "END_EXPERIMENT",
  ERROR: "ERROR"
}

function resolveExperimentState () {

}

function nextExperimentState () {
  switch (experimentState.global) {
    case null:
      globalState.setState(globalState.REGISTRATION);
      break;
    case globalState.REGISTRATION:
      globalState.setState(globalState.SHOW_RULES);
      break;
    case globalState.SHOW_RULES:
      globalState.setState(globalState.TEST);
      break;
    case globalState.TEST:
      globalState.setState(globalState.EXPERIMENT);
      break;
    case globalState.EXPERIMENT:
      globalState.setState(globalState.END);
      break;
    case globalState.END:
      globalState.setState(globalState.REGISTRATION);
      break;
  }
}

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
  nextGlobalState();
}
start_test.onclick = () => {
  nextGlobalState();
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

var gameState = {
  gameStarted: false,
  startGame: function ( ) { this.gameStarted = true; },
  endGame: function ( ) { this.gameStarted = false; },
}

var seriesState = {
  ready: false,
  start: function ( ) { this.ready = true; },
  end: function ( ) { this.ready = false; },
}

function timer(callback, delay) {
  timer.clear();
  timer.current = setTimeout(callback, delay);
};
timer.clear = () => clearTimeout(timer.current);

var nrand = (a, b) => Math.round(a + Math.random() * (b - a));

var results = [];

addEventListener("keypress", e => {
  var result = stopWatch.stop();
  if (e.charCode === 32) {
    if (gameState.gameStarted) {
      gameState.endGame();
      timer.clear();
      if (pressPermission.isAllowedPress) {
        gameField.showMessage(result);
        saveResult(result);
      } else {
          gameField.showMessage("Error");
          showExperiment();
      }
    } else if (seriesState.ready) {
      gameField.showMessage("");
      seriesState.end();
      showExperiment();
    }
  }
});

function saveResult(result) {
  results.push(result)
  if (results.length % settings.numberOfExperiments[0] === 0) {
    // refactor this
    settings.attentionTime.shift();
    settings.numberOfExperiments.shift();
    settings.message.shift();

    gameField.showMessage(settings.message[0]);
    seriesState.start();
    // timer(() => showExperiment(), 1000);
  } else {
    showExperiment();
  }
}

function showExperiment(time) {
  var attentionTime = settings.attentionTime[0]; // time
  var waitBeforeRed = settings.waitBeforeRed;
  
  // убрать отсюда
  if (!attentionTime) {
    timer(() => gameField.showMessage("Game over!"), 1000);
    return;
  } 
  
  pressPermission.diallowPress();
  gameState.startGame();

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
  
  return timer(() => showAttention(), 1000);
}

globalState.setState(globalState.REGISTRATION);



function resolveGlobalState () {
  switch (state.global) {
    case globalState.REGISTRATION:
      form.style.display = "block";
      break;
    case globalState.SHOW_RULES:
      // save user
      form.style.display = "none";
      rules.style.display = "block";
      break;
    case globalState.TEST:
      rules.style.display = "none";
      gameField.showMessage(settings.message[0]);
      seriesState.start();

      break;
    case globalState.EXPERIMENT:

      break;
    case globalState.SETTINGS:

      break;
    case globalState.END:

      break;
  }
}

function nextGlobalState () {
  switch (globalState.state) {
    case null:
      globalState.setState(globalState.REGISTRATION);
      break;
    case globalState.REGISTRATION:
      globalState.setState(globalState.SHOW_RULES);
      break;
    case globalState.SHOW_RULES:
      globalState.setState(globalState.TEST);
      break;
    case globalState.TEST:
      globalState.setState(globalState.EXPERIMENT);
      break;
    case globalState.EXPERIMENT:
      globalState.setState(globalState.END);
      break;
    case globalState.END:
      globalState.setState(globalState.REGISTRATION);
      break;
  }
}