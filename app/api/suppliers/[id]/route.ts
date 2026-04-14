import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// UPDATE
export async function PUT(req: Request, { params }: any) {
  const id = Number(params.id);
  const data = await req.json();

  const updated = await prisma.supplier.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

// DELETE
export async function DELETE(req: Request, { params }: any) {
  const id = Number(params.id);

  await prisma.supplier.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Deleted" });
}