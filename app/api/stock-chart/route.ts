import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany();

  const chartData = products.map((p) => ({
    name: p.name,
    stock: p.stock,
  }));

  return NextResponse.json(chartData);
}