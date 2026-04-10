import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, phone, email, address, products, leadTime } = await req.json();
    const supplier = await prisma.supplier.update({
      where: { id: Number(params.id) },
      data: { name, phone, email, address, products, leadTime: Number(leadTime) },
    });
    return NextResponse.json(supplier);
  } catch {
    return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.supplier.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ message: "Supplier deleted" });
  } catch {
    return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
  }
}