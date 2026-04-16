import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany();

    const lowStock = products.filter(
      (p) => p.stock > 0 && p.stock <= p.threshold
    );

    const outOfStock = products.filter((p) => p.stock === 0);

    return NextResponse.json({
      lowStock,
      outOfStock,
      totalLowStock: lowStock.length,
      totalOutOfStock: outOfStock.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}