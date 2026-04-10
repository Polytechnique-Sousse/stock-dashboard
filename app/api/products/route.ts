import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error: any) {
  console.error("🔥 GET PRODUCTS ERROR:", error);

  return NextResponse.json(
    { error: error.message },
    { status: 500 }
  );
}
}

export async function POST(req: NextRequest) {
  try {
    const { name, category, price, stock, threshold } = await req.json();
    const product = await prisma.product.create({
      data: {
        name,
        category,
        price: Number(price),
        stock: Number(stock),
        threshold: Number(threshold ?? 5),
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
  console.error("🔥 CREATE PRODUCT ERROR:", error);

  return NextResponse.json(
    { error: error.message },
    { status: 500 }
  );
}
}