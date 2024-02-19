// Constants

const pomodoroModeEl = document.getElementById('pomodoroMode');
const shortBreakModeEl = document.getElementById('shortBreakMode');
const longBreakModeEl = document.getElementById('longBreakMode');

const pomodoroStartButton = document.getElementById('pomodoroStartButton');

const pomodoroStopButton = document.getElementById('pomodoroStopButton');

pomodoroStartButton.addEventListener('click', function () {
  hide(pomodoroStartButton);
  show(pomodoroStopButton);
});

function hide(domEl) {
  domEl.classList.remove('visible');
}

function show(domEl) {
  domEl.classList.add('visible');
}
