import { NextApiRequest, NextApiResponse } from "next";
import { getORM } from "@/lib/mikro-orm";
import { User } from "../../../../../entities/User";
import { loginUserType } from "../../../../../type";
import { verifyToken } from "../../api-helper";
import { createToken } from "../../api-helper";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const orm = await getORM();
  const em = orm.em.fork();
  const { email, password } = req.body as loginUserType;
  try {
    const user = await em.findOne(User, { email, password }) as {name:string,email:string};
    const token = createToken({name:user.name,email:user.email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    return res.status(200).json({ message: "Login successful", user,token });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
}
