import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { Request } from "../../../../entities/Request";
import { User } from "../../../../entities/User";
import { getORM } from "@/lib/mikro-orm";

import { ObjectId } from "mongodb";


export async function POST(req: NextRequest) {
  try {
    const orm = await getORM();
    const em = orm.em.fork();

    const body = await req.json();
    const { user_id, request_url, method, headers, timestamp, request_id, ...otherFields } = body;

    // Validate required fields
    if (!user_id || !request_url || !method || !timestamp || !request_id) {
      return NextResponse.json(
        { error: "Missing required fields: user_id, request_url, method, timestamp, request_id" },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await em.findOne(User, { _id : new ObjectId(user_id) });
    console.log("userCame out", user);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create new Request entity
    const newRequest = em.create(Request, {
      User: user,
      request_url,
      method,
      headers,
      timestamp,
      request_id,
      ...otherFields,
      createdAt: new Date(),
    });

    await em.persistAndFlush(newRequest);

    return NextResponse.json(
      { message: "Request created successfully", data: newRequest },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create request", details: error.Concurrent },
      { status: 500 }
    );
  }
}








// GET: Retrieve all Requests with Pagination
export async function GET(req: NextRequest) {
  try {
    const orm = await getORM();
    const em = orm.em.fork();

    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = parseInt(searchParams.get("skip") || "0", 10);

    // Validate pagination parameters
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { error: "Invalid limit parameter; must be a positive number" },
        { status: 400 }
      );
    }
    if (isNaN(skip) || skip < 0) {
      return NextResponse.json(
        { error: "Invalid skip parameter; must be a non-negative number" },
        { status: 400 }
      );
    }

    // Fetch requests with pagination, optionally filtered by user_id
    const [requests, total] = await em.findAndCount(
      Request,
      user_id ? { User: user_id }  : {}, // Corrected field name to user_id
      {
        populate: ["User"], // Populate user_id for full user details
        limit,
        offset: skip,
        orderBy: { createdAt: "desc" }, // Sort by createdAt descending (latest first)
      }
    );

    return NextResponse.json(
      {
        message: "Requests retrieved successfully",
        data: requests,
        pagination: {
          limit,
          skip,
          total,
          hasMore: skip + requests.length < total,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve requests", details: error.message },
      { status: 500 }
    );
  }
}



// PUT: Update an existing Request by request_id
export async function PUT(req: NextRequest) {
  try {
    const orm = await getORM();
    const em = orm.em.fork();

    const body = await req.json();
    const { request_id, user_id, ...updateFields } = body;

    if (!request_id) {
      return NextResponse.json(
        { error: "request_id is required" },
        { status: 400 }
      );
    }

    // Find the existing request
    const existingRequest = await em.findOne(Request, { request_id });
    if (!existingRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    // If user_id is provided, verify user exists
    if (user_id) {
      const user = await em.findOne(User, { _id: user_id });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      updateFields.user_id = user;
    }

    // Update the request with new fields
    em.assign(existingRequest, updateFields);
    await em.persistAndFlush(existingRequest);

    return NextResponse.json(
      { message: "Request updated successfully", data: existingRequest },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update request", details: error.message },
      { status: 500 }
    );
  }
}