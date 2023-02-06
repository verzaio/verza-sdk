// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';

import {EngineManager} from '@verza/sdk';

import {initServer} from '@app/server/server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // allow only POST packets
  if (req.method !== 'POST') {
    res.status(200).json({success: false});
    return;
  }

  // init verza engine
  const engine = new EngineManager({
    accessToken: process.env['VERZA_ACCESS_TOKEN'],
  });

  initServer(engine);

  const response = await engine.api.handle(req.body);

  res.status(200).json(response);
}