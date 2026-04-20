import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// UPDATE
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  const data = await req.json();

  const updated = await prisma.supplier.update({
    where: { id },
    data: {
      name: data.name,
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
      products: data.products || null,
    },
  });

  return NextResponse.json(updated);
}

// DELETE
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  await prisma.supplier.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Deleted" });
}