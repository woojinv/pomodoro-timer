let countDown;

function startTimer(duration) {
  console.log(' timer startted');

  countDown = setInterval(function () {
    duration--;
    postMessage(duration);
    if (duration <= 0) {
      clearInterval(countDown);
      postMessage('countDownComplete');
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(countDown);
}

onmessage = function (e) {
  if (e.data.command === 'startTimer') {
    startTimer(e.data.totalSeconds);
  } else if (e.data.command === 'stopTimer') {
    stopTimer();
  }
};
