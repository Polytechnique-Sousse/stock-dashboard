import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supplierId = Number(id);

    if (isNaN(supplierId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();

    const updatedSupplier = await prisma.supplier.update({
      where: { id: supplierId },
      data: {
        name: body.name?.trim(),
        phone: body.phone ?? "",
        email: body.email ?? "",
        address: body.address ?? "",
      },
    });

    return NextResponse.json(updatedSupplier);
  } catch (error) {
    console.error("UPDATE ERROR:", error);

    return NextResponse.json(
      { error: "Update failed", details: String(error) },
      { status: 500 }
    );
  }
}