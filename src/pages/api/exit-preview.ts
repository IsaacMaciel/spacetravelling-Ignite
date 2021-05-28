import { NextApiResponse } from 'next';

const exitPreview = async (_, res: NextApiResponse) => {
  res.clearPreviewData();

  res.writeHead(307, { location: '/' });
  res.end();
};

export { exitPreview };
