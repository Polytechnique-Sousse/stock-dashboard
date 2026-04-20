import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("BODY =", body);

    const productId = Number(body.productId);
    const quantity = Number(body.quantity);

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: "productId and quantity required" },
        { status: 400 }
      );
    }

    // vérifier produit
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // 1. créer inbound
    const inbound = await prisma.inbound.create({
      data: {
        productId,
        quantity,
      },
    });

    // 2. update stock
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        stock: {
          increment: quantity,
        },
      },
    });

    return NextResponse.json({
      inbound,
      updatedProduct,
    });

  } catch (error) {
    console.error("INBOUND ERROR =", error);

    return NextResponse.json(
      { error: "Server error", details: String(error) },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const inbound = await prisma.inbound.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: true,
      },
    });

    return NextResponse.json(inbound);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch inbound" },
      { status: 500 }
    );
  }
}