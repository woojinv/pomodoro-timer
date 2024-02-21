// Imports
const clickAudio = new Audio('./sounds/click.mp3');
const notificationAudio = new Audio('./sounds/short-break-end.mp3');
const pomodoroWorker = new Worker('timerWorker.js');
const shortBreakWorker = new Worker('timerWorker.js');
const longBreakWorker = new Worker('timerWorker.js');

// Constants
const POMODORO_SECONDS = 25 * 60;
const SHORT_BREAK_SECONDS = 5 * 60;
const LONG_BREAK_SECONDS = 15 * 60;

// DOM elements
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

// Register event listeners
document.addEventListener('DOMContentLoaded', domContentLoadedHandler);

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

// Global variables
let numPomodoros = 0;

let pomodoroActive = false;
let shortBreakActive = false;
let longBreakActive = false;

pomodoroStartButton.focus();

// Handler functions
// Get permission to send notifications.
function domContentLoadedHandler() {
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
}

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
  startTimer(pomodoroWorker, totalSeconds);

  pomodoroActive = true;

  pomodoroWorker.onmessage = function (e) {
    if (e.data === 'countDownComplete') {
      pomodoroActive = false;
      setTimerEl(pomodoroTimerEl, POMODORO_SECONDS);

      hide(pomodoroContainer);
      hide(pomodoroStopButton);
      hide(pomodoroResetButton);
      show(pomodoroStartButton);

      numPomodoros++;

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
      return;
    }
    totalSeconds = e.data;
    setTimerEl(pomodoroTimerEl, totalSeconds);
  };
  playClickSound();
}

function pomodoroStopButtonHandler() {
  stopTimer(pomodoroWorker);
  pomodoroActive = false;
  hide(pomodoroStopButton);
  show(pomodoroStartButton);
  pomodoroStartButton.focus();
}

function pomodoroResetButtonHandler() {
  stopTimer(pomodoroWorker);
  pomodoroActive = false;
  setTimerEl(pomodoroTimerEl, POMODORO_SECONDS);
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
  startTimer(shortBreakWorker, totalSeconds);

  shortBreakActive = true;

  shortBreakWorker.onmessage = function (e) {
    if (e.data === 'countDownComplete') {
      shortBreakActive = false;
      setTimerEl(shortBreakTimerEl, SHORT_BREAK_SECONDS);

      hide(shortBreakContainer);
      hide(shortBreakStopButton);
      hide(shortBreakResetButton);
      show(shortBreakStartButton);
      show(shortBreakContainer);
      displayCurrentMode(pomodoroModeEl);
      pomodoroStartButton.focus();
      notify();
      return;
    }

    totalSeconds = e.data;
    setTimerEl(shortBreakTimerEl, totalSeconds);
  };

  playClickSound();
}

function shortBreakStopButtonHandler() {
  stopTimer(shortBreakWorker);
  shortBreakActive = false;
  hide(shortBreakStopButton);
  show(shortBreakStartButton);
  shortBreakStartButton.focus();
}

function shortBreakResetButtonHandler() {
  stopTimer(shortBreakWorker);
  shortBreakActive = false;
  setTimerEl(shortBreakTimerEl, SHORT_BREAK_SECONDS);
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

  startTimer(longBreakWorker, totalSeconds);

  longBreakActive = true;

  longBreakWorker.onmessage = function (e) {
    if (e.data === 'countDownComplete') {
      longBreakActive = false;
      setTimerEl(longBreakTimerEl, LONG_BREAK_SECONDS);

      hide(longBreakContainer);
      hide(longBreakStopButton);
      hide(longBreakResetButton);
      show(longBreakStartButton);
      show(longBreakContainer);
      displayCurrentMode(pomodoroModeEl);
      pomodoroStartButton.focus();
      notify();
      return;
    }

    totalSeconds = e.data;
    setTimerEl(longBreakTimerEl, totalSeconds);
  };

  playClickSound();
}

function longBreakStopButtonHandler() {
  stopTimer(longBreakWorker);
  longBreakActive = false;
  hide(longBreakStopButton);
  show(longBreakStartButton);
  longBreakStartButton.focus();
}

function longBreakResetButtonHandler() {
  stopTimer(longBreakWorker);
  longBreakActive = false;
  setTimerEl(longBreakTimerEl, LONG_BREAK_SECONDS);
  hide(longBreakResetButton);
  show(longBreakStartButton);
  longBreakStartButton.focus();
  hide(longBreakStopButton);
}

// Helper functions
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

function getTotalSeconds(timerEl) {
  const timeValues = timerEl.innerHTML.split(':');
  const minutes = Number(timeValues[0]);
  const seconds = Number(timeValues[1]);
  return minutes * 60 + seconds;
}

function startTimer(worker, seconds) {
  worker.postMessage({ command: 'startTimer', seconds });
}

function stopTimer(worker) {
  worker.postMessage({ command: 'stopTimer' });
}

function notify() {
  if (Notification.permission === 'granted') {
    new Notification("Time's up!").addEventListener('click', function () {
      window.focus();
      this.close();
    });
  }

  notificationAudio.play();
}

function playClickSound() {
  clickAudio.play();
}
