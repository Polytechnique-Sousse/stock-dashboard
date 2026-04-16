import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ================= GET ALL =================
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ================= CREATE =================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newProduct = await prisma.product.create({
      data: {
        name: body.name?.trim(),
        category: body.category ?? "",
        price: Number(body.price),
        stock: Number(body.stock),
        threshold: Number(body.threshold ?? 5),
      },
    });

    return NextResponse.json(newProduct);

  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}