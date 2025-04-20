import { NextRequest, NextResponse } from "next/server";
import { MikroORM, EntityManager } from "@mikro-orm/core";
import { MongoDriver } from "@mikro-orm/mongodb";
import { getORM } from "../../../../lib/mikro-orm"; // Adjust path to your ORM setup
import { Request } from "../../../../../entities/Request";


// GET: Retrieve a single Request by request_id (for completeness)
export async function GET(req: NextRequest, { params }: { params: { request_id: string } }) {
  try {
    const orm = await getORM();
    const em = orm.em.fork();

    const request_id = params.request_id;
    const request = await em.findOne(Request, { request_id }, { populate: ["user"] });

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Request retrieved successfully", data: request },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve request", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a Request by request_id
export async function DELETE(req: NextRequest, { params }: { params: { request_id: string } }) {
  try {
    const orm = await getORM();
    const em = orm.em.fork();

    const request_id = params.request_id;
    const existingRequest = await em.findOne(Request, { request_id });

    if (!existingRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    await em.removeAndFlush(existingRequest);

    return NextResponse.json(
      { message: "Request deleted successfully", request_id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete request", details: error.message },
      { status: 500 }
    );
  }
}