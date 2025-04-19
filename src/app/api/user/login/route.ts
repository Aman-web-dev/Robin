import { NextRequest,NextResponse } from "next/server";
import { getORM } from "@/lib/mikro-orm";
import { User } from "../../../../../entities/User";
import { loginUserType } from "../../../../../type";

import { createToken } from "../../api-helper";

export async function POST(req: NextRequest) {
  const orm = await getORM();
  const em = orm.em.fork();
  const { email , password } = await req.json() as loginUserType;
  try {
    const user = await em.findOne(User, { email, password }) as {name:string,email:string};
    const token = createToken({name:user.name,email:user.email });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
    return NextResponse.json({ message: "Login successful", user, token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
