import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany(); // ← doit être .product
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const { name, category, price, stock, threshold } = await req.json();
  const product = await prisma.product.create({ // ← doit être .product
    data: { name, category, price: Number(price), stock: Number(stock), threshold: Number(threshold ?? 5) },
  });
  return NextResponse.json(product, { status: 201 });
}