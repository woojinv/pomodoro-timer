/*
 * See https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API for more details regarding Web Workers.

 * Web Workers were used because the main thread was being throttled by Chrome when the app was not in focus, 
 * thus stopping the execution of setInterval().

 */

let timer;

// Send a message back to worker in the main thread.
// Every second, send a message indicating the total seconds.
function startTimer(seconds) {
  timer = setInterval(function () {
    if (seconds <= 0) {
      clearInterval(timer);
      postMessage('countDownComplete');
      return;
    }

    seconds--;
    postMessage(seconds);
  }, 1000);
}

// Listens for messages, and routes accordingly based on specified command.
onmessage = function (e) {
  if (e.data.command === 'startTimer') {
    startTimer(e.data.seconds);
  } else if (e.data.command === 'stopTimer') {
    clearInterval(timer);
  }
};
