import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET ALL
export async function GET() {
  const suppliers = await prisma.supplier.findMany();
  return NextResponse.json(suppliers);
}

// CREATE
export async function POST(req: Request) {
  const body = await req.json();

const supplier = await prisma.supplier.create({
  data: {
    name: body.name,
    phone: body.phone || null,
    email: body.email || null,
    address: body.address || null,
  },
});

  return NextResponse.json(supplier);
}