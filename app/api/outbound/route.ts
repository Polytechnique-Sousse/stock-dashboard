import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("OUTBOUND BODY =", body);

    const productId = Number(body.productId);
    const quantity = Number(body.quantity);

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: "productId and quantity required" },
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

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: "Stock insuffisant" },
        { status: 400 }
      );
    }

    const outbound = await prisma.outbound.create({
      data: {
        productId,
        quantity,
        client: body.client || "",
        amount: body.amount || 0,
      },
    });

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });

    return NextResponse.json({
      outbound,
      updatedProduct,
    });

  } catch (error) {
    console.error("OUTBOUND ERROR =", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}