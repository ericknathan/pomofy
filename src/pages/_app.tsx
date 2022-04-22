import 'react-toastify/dist/ReactToastify.css';
import 'styles/globals.scss';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ToastContainer />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
