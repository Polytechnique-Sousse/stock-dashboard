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
        { error: "productId and quantity required" }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: "Stock insuffisant" }
      );
    }

    const outbound = await prisma.outbound.create({
      data: {
        productId,
        quantity,
        client: body.client || "",
        amount: Number(body.amount),
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
      { error: "Server error" }
    );
  }
}
export async function GET() {
  try {
    const outbound = await prisma.outbound.findMany({
      orderBy: { createdAt: "desc" },
    });

    return Response.json(outbound);
  } catch (error) {
    return Response.json({ error: "Failed to fetch outbound" }, { status: 500 });
  }
}