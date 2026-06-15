import { NextResponse } from "next/server";
import { generateCloudinarySignature } from "@/app/actions/media";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paramsToSign } = body;
    
    const signature = await generateCloudinarySignature(paramsToSign);
    return NextResponse.json({ signature });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
