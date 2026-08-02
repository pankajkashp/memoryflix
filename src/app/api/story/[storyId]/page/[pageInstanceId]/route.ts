import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ storyId: string; pageInstanceId: string }> }
) {
  try {
    const { storyId, pageInstanceId } = await context.params;
    const body = await request.json();

    const instance = await prisma.storyPageInstance.findFirst({
      where: {
        id: pageInstanceId,
        storyId,
      },
    });

    if (!instance) {
      return NextResponse.json(
        { success: false, error: "Page instance not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.storyPageInstance.update({
      where: { id: pageInstanceId },
      data: {
        fieldValues: body.fieldValues || body,
      },
    });

    return NextResponse.json({ success: true, instance: updated });
  } catch (err: any) {
    console.error("PATCH pageInstance error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to save page data" },
      { status: 500 }
    );
  }
}
