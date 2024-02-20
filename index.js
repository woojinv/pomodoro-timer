// Constants
const pomodoroSeconds = 5;
const shortBreakSeconds = 6;
const longBreakSeconds = 7;

const pomodoroModeEl = document.getElementById('pomodoroMode');
const shortBreakModeEl = document.getElementById('shortBreakMode');
const longBreakModeEl = document.getElementById('longBreakMode');

const pomodoroContainer = document.getElementById('pomodoroContainer');
const shortBreakContainer = document.getElementById('shortBreakContainer');
const longBreakContainer = document.getElementById('longBreakContainer');

const pomodoroTimerEl = document.getElementById('pomodoroTimer');
const shortBreakTimerEl = document.getElementById('shortBreakTimer');
const longBreakTimerEl = document.getElementById('longBreakTimer');

const pomodoroStartButton = document.getElementById('pomodoroStartButton');
const shortBreakStartButton = document.getElementById('shortBreakStartButton');
const longBreakStartButton = document.getElementById('longBreakStartButton');

const pomodoroStopButton = document.getElementById('pomodoroStopButton');
const shortBreakStopButton = document.getElementById('shortBreakStopButton');
const longBreakStopButton = document.getElementById('longBreakStopButton');

const pomodoroResetButton = document.getElementById('pomodoroResetButton');
const shortBreakResetButton = document.getElementById('shortBreakResetButton');
const longBreakResetButton = document.getElementById('longBreakResetButton');

let pomodoroTimer;
let shortBreakTimer;
let longBreakTimer;

let pomodoroActive = false;
let shortBreakActive = false;
let longBreakActive = false;

let numPomodoros = 0;

pomodoroStartButton.focus();

// Get permission to send notifications.
document.addEventListener('DOMContentLoaded', function () {
  if ('Notification' in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification('Notifications enabled');
      } else {
        console.log('Notification permission denied');
      }
    });
  } else {
    console.log('Notifications not available in this browser.');
  }
});

/*
 * Register event listeners
 */
pomodoroModeEl.addEventListener('click', pomodoroModeElHandler);
shortBreakModeEl.addEventListener('click', shortBreakModeElHandler);
longBreakModeEl.addEventListener('click', longBreakModeElHandler);

pomodoroStartButton.addEventListener('click', pomodoroStartButtonHandler);
pomodoroStopButton.addEventListener('click', pomodoroStopButtonHandler);
pomodoroResetButton.addEventListener('click', pomodoroResetButtonHandler);

shortBreakStartButton.addEventListener('click', shortBreakStartButtonHandler);
shortBreakStopButton.addEventListener('click', shortBreakStopButtonHandler);
shortBreakResetButton.addEventListener('click', shortBreakResetButtonHandler);

longBreakStartButton.addEventListener('click', longBreakStartButtonHandler);
longBreakStopButton.addEventListener('click', longBreakStopButtonHandler);
longBreakResetButton.addEventListener('click', longBreakResetButtonHandler);

/*
 * Handler functions
 */
function pomodoroModeElHandler() {
  hide(shortBreakContainer);
  hide(longBreakContainer);
  show(pomodoroContainer);
}

function shortBreakModeElHandler() {
  hide(pomodoroContainer);
  hide(longBreakContainer);
  show(shortBreakContainer);
}

function longBreakModeElHandler() {
  hide(pomodoroContainer);
  hide(shortBreakContainer);
  show(longBreakContainer);
}

function pomodoroStartButtonHandler() {
  shortBreakResetButtonHandler();
  longBreakResetButtonHandler();

  hide(pomodoroStartButton);
  show(pomodoroStopButton);
  pomodoroStopButton.focus();
  show(pomodoroResetButton);

  let totalSeconds = getTotalSeconds(pomodoroTimerEl);

  pomodoroTimer = setInterval(function () {
    pomodoroActive = true;
    totalSeconds -= 1;
    setTimerEl(pomodoroTimerEl, totalSeconds);

    if (totalSeconds === 0) {
      stopTimer(pomodoroTimer);
      pomodoroActive = false;
      setTimerEl(pomodoroTimerEl, pomodoroSeconds);

      hide(pomodoroContainer);
      hide(pomodoroStopButton);
      hide(pomodoroResetButton);
      show(pomodoroStartButton);

      numPomodoros += 1;

      if (numPomodoros !== 4) {
        show(shortBreakContainer);
        displayCurrentMode(shortBreakModeEl);
        shortBreakStartButton.focus();
      } else {
        numPomodoros = 0;
        show(longBreakContainer);
        displayCurrentMode(longBreakModeEl);
        longBreakStartButton.focus();
      }

      notify();
    }
  }, 1000);
}

function pomodoroStopButtonHandler() {
  stopTimer(pomodoroTimer);
  pomodoroActive = false;
  hide(pomodoroStopButton);
  show(pomodoroStartButton);
  pomodoroStartButton.focus();
}

function pomodoroResetButtonHandler() {
  stopTimer(pomodoroTimer);
  pomodoroActive = false;
  setTimerEl(pomodoroTimerEl, pomodoroSeconds);
  hide(pomodoroResetButton);
  show(pomodoroStartButton);
  pomodoroStartButton.focus();
  hide(pomodoroStopButton);
}

function shortBreakStartButtonHandler() {
  pomodoroResetButtonHandler();
  longBreakResetButtonHandler();

  hide(shortBreakStartButton);
  show(shortBreakStopButton);
  shortBreakStopButton.focus();
  show(shortBreakResetButton);

  let totalSeconds = getTotalSeconds(shortBreakTimerEl);

  shortBreakTimer = setInterval(function () {
    shortBreakActive = true;
    totalSeconds -= 1;
    setTimerEl(shortBreakTimerEl, totalSeconds);

    if (totalSeconds === 0) {
      stopTimer(shortBreakTimer);
      shortBreakActive = false;
      setTimerEl(shortBreakTimerEl, shortBreakSeconds);

      hide(shortBreakContainer);
      hide(shortBreakStopButton);
      hide(shortBreakResetButton);
      show(shortBreakStartButton);
      show(pomodoroContainer);
      displayCurrentMode(pomodoroModeEl);
      pomodoroStartButton.focus();

      notify();
    }
  }, 1000);
}

function shortBreakStopButtonHandler() {
  stopTimer(shortBreakTimer);
  shortBreakActive = false;
  hide(shortBreakStopButton);
  show(shortBreakStartButton);
  shortBreakStartButton.focus();
}

function shortBreakResetButtonHandler() {
  stopTimer(shortBreakTimer);
  shortBreakActive = false;
  setTimerEl(shortBreakTimerEl, shortBreakSeconds);
  hide(shortBreakResetButton);
  show(shortBreakStartButton);
  shortBreakStartButton.focus();
  hide(shortBreakStopButton);
}

function longBreakStartButtonHandler() {
  pomodoroResetButtonHandler();
  shortBreakResetButtonHandler();

  hide(longBreakStartButton);
  show(longBreakStopButton);
  longBreakStopButton.focus();
  show(longBreakResetButton);

  let totalSeconds = getTotalSeconds(longBreakTimerEl);

  longBreakTimer = setInterval(function () {
    longBreakActive = true;
    totalSeconds -= 1;
    setTimerEl(longBreakTimerEl, totalSeconds);

    if (totalSeconds === 0) {
      stopTimer(longBreakTimer);
      longBreakActive = false;
      setTimerEl(longBreakTimerEl, longBreakSeconds);

      hide(longBreakContainer);
      hide(longBreakStopButton);
      hide(longBreakResetButton);
      show(longBreakStartButton);
      show(pomodoroContainer);
      displayCurrentMode(pomodoroModeEl);
      pomodoroStartButton.focus();

      notify();
    }
  }, 1000);
}

function longBreakStopButtonHandler() {
  stopTimer(longBreakTimer);
  longBreakActive = false;
  hide(longBreakStopButton);
  show(longBreakStartButton);
  longBreakStartButton.focus();
}

function longBreakResetButtonHandler() {
  stopTimer(longBreakTimer);
  longBreakActive = false;
  setTimerEl(longBreakTimerEl, longBreakSeconds);
  hide(longBreakResetButton);
  show(longBreakStartButton);
  longBreakStartButton.focus();
  hide(longBreakStopButton);
}

/*
 * DOM manipulation functions
 */

function hide(domEl) {
  domEl.classList.remove('visible');
}

function show(domEl) {
  domEl.classList.add('visible');
}

function displayCurrentMode(modeEl) {
  modeEl.checked = true;
}

function setTimerEl(timerEl, seconds) {
  const newMinutes = Math.floor(seconds / 60);
  const formattedMinutes = newMinutes < 10 ? '0' + newMinutes : newMinutes;
  const newSeconds = seconds % 60;
  const formattedSeconds = newSeconds < 10 ? '0' + newSeconds : newSeconds;
  timerEl.innerHTML = `${formattedMinutes}:${formattedSeconds}`;
}

/*
 * Helper functions
 */
function getTotalSeconds(timerEl) {
  const timeValues = timerEl.innerHTML.split(':');
  const minutes = Number(timeValues[0]);
  const seconds = Number(timeValues[1]);
  return minutes * 60 + seconds;
}

function stopTimer(timer) {
  clearInterval(timer);
}

function notify() {
  if (Notification.permission === 'granted') {
    new Notification("Time's up!").addEventListener('click', function () {
      window.focus();
      this.close();
    });
  }

  new Audio('./sounds/short-break-end.mp3').play();
}
