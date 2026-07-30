import { NextResponse } from "next/server";
import { generateCloudinarySignature } from "@/app/actions/media";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const ParamsSchema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]));

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { paramsToSign } = body;
    
    const parsedParams = ParamsSchema.parse(paramsToSign);
    
    const signature = await generateCloudinarySignature(parsedParams);
    return NextResponse.json({ signature });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Bad Request" }, { status: 400 });
  }
}
