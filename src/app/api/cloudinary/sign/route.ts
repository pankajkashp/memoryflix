import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ParamsSchema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]));

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paramsToSign } = body;

    const parsedParams = ParamsSchema.parse(paramsToSign);

    const secret = process.env.CLOUDINARY_API_SECRET;
    if (!secret) {
      return NextResponse.json({ signature: "mock_signature_dev" });
    }

    const signature = cloudinary.utils.api_sign_request(parsedParams, secret);
    return NextResponse.json({ signature });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Bad Request" },
      { status: 400 }
    );
  }
}
