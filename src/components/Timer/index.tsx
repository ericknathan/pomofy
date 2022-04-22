import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './timer.module.scss';

export function Timer() {
  const session = useSession();

  const longTime = 25 * 60; // 25 minutes
  const shortTime = 5 * 60; // 5 minutes

  const [time, setTime] = useState(longTime);
  const [isActive, setIsActive] = useState('long - paused');
  const [hasTimeFinished, setHasTimeFinished] = useState(false);
  let countdownTimeout: NodeJS.Timeout;

  const seconds = time % 60 < 10 ? `0${time % 60}` : time % 60;
  const minutes =
    Math.floor(time / 60) < 10
      ? `0${Math.floor(time / 60)}`
      : Math.floor(time / 60);

  useEffect(() => {
    if (isActive.includes('focus')) {
      if (time > 0) {
        countdownTimeout = setTimeout(() => {
          setTime(time - 1);
        }, 1000);
      } else if (time === 0) {
        setHasTimeFinished(true);
        if (isActive === 'long - focus') {
          setIsActive('long - paused');
          setTime(longTime);
        } else {
          setIsActive('short - paused');
          setTime(shortTime);
        }

        stopPlayingTrack();
      }
    }
  }, [isActive, time]);

  useEffect(() => {
    if (hasTimeFinished) {
      let text = '';
      if (isActive.includes('short')) {
        text = 'Its time to take a break! Click here to start.';
      } else {
        text = 'Its time to focus! Click here to start.';
      }

      const notification = new Notification('Pomofy', {
        body: text,
        icon: 'notification.png'
      });
      var audio = new Audio('audio.mp3');
      audio.play();

      notification.onclick = () => {
        window.focus();
        notification.close();

        if (isActive.includes('short')) {
          setIsActive('short - focus');
        } else {
          setIsActive('long - focus');
        }
        setHasTimeFinished(false);
      };

      notification.onclose = () => {
        audio.pause();
      };

      setTimeout(() => {
        notification.close();
      }, 10000);
    }
  }, [hasTimeFinished]);

  useEffect(() => {
    function checkNotificationPromise() {
      try {
        Notification.requestPermission().then();
      } catch {
        return false;
      }

      return true;
    }

    if ('Notification' in window) {
      if (checkNotificationPromise()) {
        Notification.requestPermission();
      }
    }
  }, []);

  function resumeTrack() {
    return axios
      .put('https://api.spotify.com/v1/me/player/play', null, {
        headers: {
          Authorization: `Bearer ${session.data.accessToken}`
        }
      })
      .catch(error => {
        return error;
      });
  }

  function stopPlayingTrack() {
    return axios
      .put('https://api.spotify.com/v1/me/player/pause', null, {
        headers: {
          Authorization: `Bearer ${session.data.accessToken}`
        }
      })
      .catch(error => {
        return error;
      });
  }

  async function startCountdown() {
    try {
      setHasTimeFinished(false);

      if (isActive === 'long - paused') setIsActive('short - focus');
      else if (isActive === 'short - paused') setIsActive('long - focus');

      await resumeTrack();
    } catch (error) {
      const errorMessage = error.response.data.error.message;
      if (errorMessage.includes('Restriction violated')) {
        return toast.info('The music is already playing!');
      } else if (errorMessage.includes('No active device found')) {
        return toast.error('No active device found!');
      }

      return toast.error(error.response?.data?.error?.message);
    }
  }

  async function stopCountdown() {
    try {
      if (isActive === 'long - focus') setIsActive('long - paused');
      else if (isActive === 'short - focus') setIsActive('short - paused');

      await stopPlayingTrack();
    } catch (error) {
      const errorMessage = error.response.data.error.message;
      if (errorMessage.includes('Restriction violated')) {
        return toast.info('The music is already stopped!');
      } else if (errorMessage.includes('No active device found')) {
        return toast.error('No active device found!');
      }

      return toast.error(error.response?.data?.error?.message);
    }
  }

  function resetCountdown() {
    setTime(longTime);
    setHasTimeFinished(false);
    setIsActive('long - paused');
    stopPlayingTrack();
  }

  return (
    <div className={styles.timerWrapper}>
      <h1 className={styles.timer}>
        <span>{minutes}</span>:<span>{seconds}</span>
      </h1>
      <div className={styles.controllers}>
        {!isActive.includes('focus') && time !== longTime ? (
          <>
            {time !== 0 && <button onClick={startCountdown}>Continue</button>}
            <button onClick={resetCountdown}>Restart</button>
          </>
        ) : (
          !isActive.includes('focus') && (
            <button onClick={startCountdown}>Start</button>
          )
        )}
        {isActive.includes('focus') && (
          <button onClick={stopCountdown}>Pause</button>
        )}
      </div>
    </div>
  );
}
