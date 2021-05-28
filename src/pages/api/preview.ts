import Prismic from "@prismicio/client"
import {Document} from '@prismicio/client/types/documents'
import { NextApiRequest, NextApiResponse } from "next";

const linkResolver = (doc: Document): string => {
  if (doc.type === 'posts') return `/post/${doc.uid}`;

  return '/'
}

const createClientOptions = (req = null, prismicAccessToken = null) => {
  const reqOption = req ? { req } : {};
  const accessTokenOption = prismicAccessToken
    ? { accessToken: prismicAccessToken }
    : {};
  return {
    ...reqOption,
    ...accessTokenOption,
  };
};

const Client = (req = null) =>
  Prismic.client(
    process.env.PRISMIC_API_ENDPOINT,
    createClientOptions(req, process.env.PRIMISC_ACCESS_TOKEN)
  );

const preview  =  async (req: NextApiRequest, res: NextApiResponse) => {
    const { token: ref, documentId } = req.query;
    const redirectUrl = await Client(req)
      .getPreviewResolver(String(ref), String(documentId))
      .resolve(linkResolver, '/');

    if (!redirectUrl) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.setPreviewData({ ref });

    res.writeHead(302, { Location: `${redirectUrl}` });

    res.end();
  };

  export { preview }
