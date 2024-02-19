// Constants
const pomodoroSeconds = 5;
const shortBreakSeconds = 6;
const longBreakSeconds = 7;

const pomodoroModeEl = document.getElementById('pomodoroMode');
const shortBreakModeEl = document.getElementById('shortBreakMode');
const longBreakModeEl = document.getElementById('longBreakMode');

const timerEl = document.getElementById('timer');

const startButton = document.getElementById('startButton');

pomodoroModeEl.addEventListener('change', function () {
  timerEl.innerHTML = getFormattedTime(pomodoroSeconds);
});

shortBreakModeEl.addEventListener('change', function () {
  timerEl.innerHTML = getFormattedTime(shortBreakSeconds);
});

startButton.addEventListener('click', function () {
  let totalSeconds = getTotalSeconds();

  const timer = setInterval(function () {
    totalSeconds -= 1;
    timerEl.innerHTML = getFormattedTime(totalSeconds);
  }, 1000);
});

function getFormattedTime(seconds) {
  const newMinutes = Math.floor(seconds / 60);
  const formattedMinutes = newMinutes < 10 ? '0' + newMinutes : newMinutes;
  const newSeconds = seconds % 60;
  const formattedSeconds = newSeconds < 10 ? '0' + newSeconds : newSeconds;
  return `${formattedMinutes}:${formattedSeconds}`;
}

function getTotalSeconds() {
  const timeValues = timerEl.innerHTML.split(':');
  const minutes = Number(timeValues[0]);
  const seconds = Number(timeValues[1]);
  return minutes * 60 + seconds;
}
// What if i click a mode button while a countodwn for that mode is happening?

// while a countdown is occurring, if a user switches to a different mode,
// should the countdown keep happening in the background?

class Timer {
  
}