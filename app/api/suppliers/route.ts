import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ================= GET ALL =================
export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { id: "desc" },
    });

    return NextResponse.json(suppliers);
  } catch (error) {
    console.error("GET SUPPLIERS ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ================= CREATE =================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newSupplier = await prisma.supplier.create({
      data: {
        name: body.name?.trim(),
        phone: body.phone ?? "",
        email: body.email ?? "",
        address: body.address ?? "",
        products: body.products ?? "",
      },
    });

    return NextResponse.json(newSupplier);

  } catch (error) {
    console.error("POST SUPPLIER ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create supplier" },
      { status: 500 }
    );
  }
}