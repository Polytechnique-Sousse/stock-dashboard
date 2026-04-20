import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // ── Produits ──────────────────────────────────────────────
    const products = await prisma.product.findMany();
    const totalProducts = products.length;
    const totalStock    = products.reduce((sum, p) => sum + (p.stock ?? 0), 0);

    // Low stock : stock <= threshold (ou <= 5 si pas de threshold)
    const lowStockProducts = products.filter(
      (p) => p.stock <= (p.threshold ?? 5)
    );
    const inStockProducts = products.filter(
      (p) => p.stock > (p.threshold ?? 5)
    );

    // ── Commandes (outbound) ──────────────────────────────────
    const orders = await prisma.outbound.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { product: true },
    });

    const totalOrders = await prisma.outbound.count();

    // ── Top produits (par quantité vendue) ───────────────────
    const salesByProduct = await prisma.outbound.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    const topProducts = await Promise.all(
      salesByProduct.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        return {
          name:  product?.name ?? "Unknown",
          sales: item._sum.quantity ?? 0,
        };
      })
    );

    // Normaliser progress (max = premier item)
    const maxSales = topProducts[0]?.sales ?? 1;
    const topProductsWithProgress = topProducts.map((p) => ({
      ...p,
      progress: Math.round((p.sales / maxSales) * 100),
    }));

    // ── Chart : ventes sur 6 mois ────────────────────────────
    const now      = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const salesChart = await prisma.outbound.groupBy({
      by: ["createdAt"],
      _sum: { quantity: true },
      where: { createdAt: { gte: sixMonthsAgo } },
    });

    // Agréger par mois
    const monthLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const chartMap: Record<string, number> = {};

    for (let i = 5; i >= 0; i--) {
      const d   = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      chartMap[key] = 0;
    }

    salesChart.forEach((row) => {
      const d   = new Date(row.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (key in chartMap) {
        chartMap[key] += row._sum.quantity ?? 0;
      }
    });

    const chartLabels = Object.keys(chartMap).map((k) => {
      const month = parseInt(k.split("-")[1]);
      return monthLabels[month];
    });
    const chartValues = Object.values(chartMap);

    // ── Recent orders formatés ───────────────────────────────
    const recentOrders = orders.map((o, idx) => ({
      id:     `#${String(totalOrders - idx).padStart(4, "0")}`,
      client: o.client,
      amount: `${((o.quantity ?? 0) * (o.product?.price ?? 0)).toFixed(3)} TND`,
      status: o.status ?? "Processing",
    }));
    const inbound = await prisma.inbound.findMany({
  orderBy: { createdAt: "desc" },
  include: {
    product: true,
  },
});
const outbound = await prisma.outbound.findMany({
  orderBy: { createdAt: "desc" },
  include: {
    product: true,
  },
});

    // ── Réponse finale ───────────────────────────────────────
    return NextResponse.json({
      totalProducts,
      totalStock,
      totalOrders,
      lowStockCount:   lowStockProducts.length,
      inStockCount:    inStockProducts.length,
      topProducts:     topProductsWithProgress,
      recentOrders,
      chartLabels,
      chartValues,
      stockItems: products.map((p) => ({
        name:      p.name,
        category:  p.category ?? "",
        stock:     p.stock,
        threshold: p.threshold ?? 5,
      })),
      inbound,
      outbound,
    });
  } catch (error) {
    console.error("[STATS ERROR]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}