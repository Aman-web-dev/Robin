import { NextApiHandler } from "next";
import { NextResponse } from "next/server";


export async function GET(){

    console.log("Got a Request")

    return NextResponse.json("hello",{status:200})
}