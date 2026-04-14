import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    //  tous les produits
    const products = await prisma.product.findMany();

    // total produits
    const totalProducts = products.length;

    // total stock
    const totalStock = products.reduce(
      (sum, p) => sum + p.stock,
      0
    );

    //  low stock (≤ 5)
    const lowStockProducts = products.filter(
      (p) => p.stock <= 5
    );

    //  alertes (stock critique = 0)
    const alerts = products.filter(
      (p) => p.stock === 0
    );

    return NextResponse.json({
      totalProducts,
      totalStock,
      lowStockCount: lowStockProducts.length,
      alertsCount: alerts.length,
      lowStockProducts,
      alerts,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}