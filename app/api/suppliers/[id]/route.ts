import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ================= UPDATE SUPPLIER =================

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supplierId = Number(id);

    if (isNaN(supplierId)) {
      return NextResponse.json(
        { error: "Invalid supplier ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const updatedSupplier = await prisma.supplier.update({
      where: { id: supplierId },
      data: {
        name: body.name?.trim(),
        email: body.email || null,
        phone: body.phone || null,
        address: body.address || null,
        // ❌ products supprimé car n'existe pas dans schema
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedSupplier,
    });

  } catch (error) {
    console.error("UPDATE SUPPLIER ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update supplier", details: String(error) },
      { status: 500 }
    );
  }
}

// ================= DELETE SUPPLIER =================
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supplierId = Number(id);

    if (!supplierId || isNaN(supplierId)) {
      return NextResponse.json(
        { error: "Invalid supplier ID" },
        { status: 400 }
      );
    }

    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
    });

    if (!supplier) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }

    await prisma.supplier.delete({
      where: { id: supplierId },
    });

    return NextResponse.json({
      success: true,
      message: "Supplier deleted",
    });

  } catch (error) {
    console.error("DELETE SUPPLIER ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete supplier" },
      { status: 500 }
    );
  }
}