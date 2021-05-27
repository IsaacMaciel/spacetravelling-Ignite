import { NextApiRequest, NextApiResponse } from "next"
import prismicResponse from '../../../test.json'

 const json = async (req: NextApiRequest, res: NextApiResponse) => {

  return res.json(prismicResponse)
}

export default json
