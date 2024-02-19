// Constants
const pomodoroSeconds = 5;
const shortBreakSeconds = 6;
const longBreakSeconds = 7;

const pomodoroModeEl = document.getElementById('pomodoroMode');
const shortBreakModeEl = document.getElementById('shortBreakMode');
const longBreakModeEl = document.getElementById('longBreakMode');

const pomodoroContainer = document.getElementById('pomodoroContainer');
const shortBreakContainer = document.getElementById('shortBreakContainer');

const pomodoroTimerEl = document.getElementById('pomodoroTimer');
const shortBreakTimerEl = document.getElementById('shortBreakTimer');

const pomodoroStartButton = document.getElementById('pomodoroStartButton');
const shortBreakStartButton = document.getElementById('shortBreakStartButton');

const pomodoroStopButton = document.getElementById('pomodoroStopButton');
const shortBreakStopButton = document.getElementById('shortBreakStopButton');

const pomodoroResetButton = document.getElementById('pomodoroResetButton');
const shortBreakResetButton = document.getElementById('shortBreakResetButton');

let pomodoroTimer;
let shortBreakTimer;

let pomodoroActive = false;
let shortBreakActive = false;

pomodoroStartButton.focus();

/*
 * Register event listeners
 */
pomodoroModeEl.addEventListener('click', pomodoroModeElHandler);
shortBreakModeEl.addEventListener('click', shortBreakModeElHandler);

pomodoroStartButton.addEventListener('click', pomodoroStartButtonHandler);
pomodoroStopButton.addEventListener('click', pomodoroStopButtonHandler);
pomodoroResetButton.addEventListener('click', pomodoroResetButtonHandler);

shortBreakStartButton.addEventListener('click', shortBreakStartButtonHandler);
shortBreakStopButton.addEventListener('click', shortBreakStopButtonHandler);
shortBreakResetButton.addEventListener('click', shortBreakResetButtonHandler);

/*
 * Handler functions
 */
function pomodoroModeElHandler() {
  hide(shortBreakContainer);
  show(pomodoroContainer);
  pomodoroActive ? pomodoroStopButton.focus() : pomodoroStartButton.focus();
}

function shortBreakModeElHandler() {
  hide(pomodoroContainer);
  show(shortBreakContainer);
  shortBreakActive ? shortBreakStopButton.focus() : shortBreakStartButton.focus();
}

function pomodoroStartButtonHandler() {
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
      show(shortBreakContainer);
      displayCurrentMode(shortBreakModeEl);
      shortBreakStartButton.focus();
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
