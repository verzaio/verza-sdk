import Head from 'next/head';
import Testing from '@app/components/Testing/Testing';

export default function Home() {
  return (
    <>
      <Head>
        <title>Testing App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Testing />
    </>
  );
}
