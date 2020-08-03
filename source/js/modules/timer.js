import changePrice from './changePrice';
import modal from './modal';

const timer = (selector, deadline) => {
  const currentTime = new Date(),
    currentDeadline = currentTime.setMinutes(currentTime.getMinutes() + deadline);

  const addZero = (num) => {
    return num <= 9 ? '0' + num : num;
  };

  const getTimeReamining = (endTime) => {
    const time = endTime - Date.parse(new Date()),
      seconds = Math.floor((time / 1000) % 60),
      minutes = Math.floor((time / 1000 / 60) % 60);

    return {
      'total': time,
      'minutes': minutes,
      'seconds': seconds
    };
  };

  const removeTimer = () => {
    const timerBox = document.querySelector(selector);
    timerBox.classList.add('offer--close');
    setTimeout(function () {
      timerBox.remove();
    }, 700);
  };

  const setClock = (selector, endTime) => {
    const timer = document.querySelector(selector),
      minutes = timer.querySelector('.offer__timer_nums--minutes'),
      seconds = timer.querySelector('.offer__timer_nums--seconds'),
      timeInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
      const time = getTimeReamining(endTime);

      minutes.textContent = addZero(time.minutes);
      seconds.textContent = addZero(time.seconds);

      if (time.total <= 0) {
        minutes.textContent = '00';
        seconds.textContent = '00';
        clearInterval(timeInterval);
        localStorage.removeItem('total');
        removeTimer();
        changePrice();
        modal('timer', '#sale');
      }
    }
  };

  if (!localStorage.getItem('total')) {
    localStorage.setItem('total', currentDeadline);
  }

  setClock(selector, localStorage.getItem('total'));

  document.querySelector('.offer__text').addEventListener('click', () => {
    document.querySelector('.offer').classList.toggle('offer--open');
  });
};

export default timer;
