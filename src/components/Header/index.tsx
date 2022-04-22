import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaSpotify } from 'react-icons/fa';
import styles from './header.module.scss';

export function Header({ currentPlayingTrack }) {
  const session = useSession();

  return (
    <header className={styles.headerWrapper}>
      <div className={styles.musicWrapper}>
        <FaSpotify size={36} color="var(--primary)" />
        <p>
          {currentPlayingTrack.track === '' ? (
            'Nothing is playing right now'
          ) : (
            <>
              <span>{currentPlayingTrack.track}</span> -{' '}
              {currentPlayingTrack.artist}
            </>
          )}
        </p>
      </div>
      <button
        className={styles.userWrapper}
        onClick={() =>
          signOut({
            callbackUrl: '/'
          })
        }
      >
        <p>{session?.data?.user?.name}</p>
        <img src={session?.data?.user?.image} alt={session?.data?.user?.name} />
      </button>
    </header>
  );
}
