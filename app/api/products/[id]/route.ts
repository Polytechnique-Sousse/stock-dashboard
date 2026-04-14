import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = Number(params.id);

    console.log("PARAMS =", params.id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "ID invalid", raw: params.id },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
export async function PUT(req: Request, { params }: any) {
  const data = await req.json();

  const product = await prisma.product.update({
    where: { id: Number(params.id) },
    data,
  });

  return NextResponse.json(product);
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