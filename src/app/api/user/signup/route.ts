import { NextApiRequest, NextApiResponse } from "next";
import { getORM } from "@/lib/mikro-orm";
import { User } from "../../../../../entities/User";
import { signupUserType } from "../../../../../type";
import { encrypt } from '../../api-helper';

export async function POST(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const orm = await getORM();
  const em = orm.em.fork();

    const { name, email, password } =await req.json() as signupUserType;
    console.log(req.body)
    console.log(name, email, password )

    const encryptedPassword= await encrypt(password);
    console.log(encryptedPassword)
    const user = em.create(User, {
      name,
      email,
      password:encryptedPassword,
      createdAt: new Date(),
    });
    await em.persistAndFlush(user);
    return res.status(201).json(user);
}

