import { a2aHandler } from "../../index";

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    const response = await a2aHandler(req);
    const data = await response.json();
    res.status(response.status).json(data);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}