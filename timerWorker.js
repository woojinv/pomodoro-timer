let countDown;

function startTimer(duration) {
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
    startTimer(e.data.seconds);
  } else if (e.data.command === 'stopTimer') {
    stopTimer();
  }
};
