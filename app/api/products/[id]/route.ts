import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ================= UPDATE PRODUCT =================
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (!productId || isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    console.log("UPDATE PRODUCT:", productId, body);

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: body.name?.trim(),
        category: body.category ?? "",
        price: Number(body.price),
        stock: Number(body.stock),
        threshold: Number(body.threshold ?? 5),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedProduct,
    });

  } catch (error) {
    console.error("PUT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// ================= DELETE PRODUCT =================
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (!productId || isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
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

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted",
    });

  } catch (error) {
    console.error("DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}