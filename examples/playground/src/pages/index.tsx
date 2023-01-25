import Head from 'next/head';
import Playground from '@app/components/Playground/Playground';

export default function Home() {
  return (
    <>
      <Head>
        <title>Testing App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Playground />
    </>
  );
}
