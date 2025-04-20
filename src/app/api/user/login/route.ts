import { NextRequest,NextResponse } from "next/server";
import { getORM } from "@/lib/mikro-orm";
import { User } from "../../../../../entities/User";
import { loginUserType } from "../../../../../type";
import { decrypt } from "../../api-helper";

import { createToken } from "../../api-helper";

export async function POST(req: NextRequest,res:NextResponse) {
  console.log("Got a Login Request");
  const orm = await getORM();
  console.log(orm)
  const em = orm.em.fork();
  console.log(em)
  const { email , password } = await req.json() as loginUserType;
  try {
    const user = await em.findOne(User, { email }) as {name:string,email:string, password:string};
    console.log(user)
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
    const isMatch = await decrypt(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
    const token = await createToken({name:user.name,email:user.email });
    return NextResponse.json({ message: "Login successful", user, token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
