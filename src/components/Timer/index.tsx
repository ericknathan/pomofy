import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './timer.module.scss';

export function Timer() {
  const session = useSession();

  const startTime = 25 * 60; // 25 minutes

  const [time, setTime] = useState(startTime);
  const [isActive, setIsActive] = useState(false);
  const [hasTimeFinished, setHasTimeFinished] = useState(false);
  let countdownTimeout: NodeJS.Timeout;

  const seconds = time % 60 < 10 ? `0${time % 60}` : time % 60;
  const minutes =
    Math.floor(time / 60) < 10
      ? `0${Math.floor(time / 60)}`
      : Math.floor(time / 60);

  useEffect(() => {
    if (isActive && time > 0) {
      countdownTimeout = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    } else if (isActive && time === 0) {
      setHasTimeFinished(true);
      setIsActive(false);
      stopPlayingTrack();
    }
  }, [isActive, time]);

  function resumeTrack() {
    return axios.put('https://api.spotify.com/v1/me/player/play', null, {
      headers: {
        Authorization: `Bearer ${session.data.accessToken}`
      }
    });
  }

  function stopPlayingTrack() {
    return axios.put('https://api.spotify.com/v1/me/player/pause', null, {
      headers: {
        Authorization: `Bearer ${session.data.accessToken}`
      }
    });
  }

  async function startCountdown() {
    try {
      setIsActive(true);
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
      setIsActive(false);
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
    setTime(startTime);
    setHasTimeFinished(false);
    setIsActive(false);
    stopPlayingTrack();
  }

  return (
    <div className={styles.timerWrapper}>
      <h1 className={styles.timer}>
        <span>{minutes}</span>:<span>{seconds}</span>
      </h1>
      <div className={styles.controllers}>
        {!isActive && time !== startTime ? (
          <>
            {time !== 0 && <button onClick={startCountdown}>Continue</button>}
            <button onClick={resetCountdown}>Restart</button>
          </>
        ) : (
          !isActive && <button onClick={startCountdown}>Start</button>
        )}
        {isActive && <button onClick={stopCountdown}>Pause</button>}
      </div>
    </div>
  );
}
