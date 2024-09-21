import { type NextApiRequest, type NextApiResponse } from "next";
import bootstrap from "../../../api/infrastructure/bootstrapRoute";

bootstrap();

export default function (_req: NextApiRequest, res: NextApiResponse) {
  res.send(`Ok`);
}
