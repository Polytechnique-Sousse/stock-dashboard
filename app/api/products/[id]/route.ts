import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, category, price, stock, threshold } = await req.json();
    const product = await prisma.product.update({
      where: { id: Number(params.id) },
      data: { name, category, price: Number(price), stock: Number(stock), threshold: Number(threshold) },
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ message: "Product deleted" });
  } catch {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}