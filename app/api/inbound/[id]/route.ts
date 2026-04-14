import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (auth.error) return auth.error;

  try {
    const { quantity, note, date } = await req.json();

    // Récupérer l'ancien inbound pour ajuster le stock
    const old = await prisma.inbound.findUnique({ where: { id: Number(params.id) } });
    if (!old) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const diff = Number(quantity) - old.quantity;

    const [inbound] = await prisma.$transaction([
      prisma.inbound.update({
        where: { id: Number(params.id) },
        data: { quantity: Number(quantity), note, date: date ? new Date(date) : undefined },
        include: { product: { select: { name: true, category: true } } },
      }),
      prisma.product.update({
        where: { id: old.productId },
        data: { stock: { increment: diff } },
      }),
    ]);

    return NextResponse.json(inbound);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (auth.error) return auth.error;

  try {
    const old = await prisma.inbound.findUnique({ where: { id: Number(params.id) } });
    if (!old) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.$transaction([
      prisma.inbound.delete({ where: { id: Number(params.id) } }),
      prisma.product.update({
        where: { id: old.productId },
        data: { stock: { decrement: old.quantity } },
      }),
    ]);

    return NextResponse.json({ message: "Inbound deleted" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function requireAuth(req: NextRequest): { error?: NextResponse } {
    // TODO: Implement authentication logic
    // Return { error: NextResponse.json(...) } if auth fails
    return {};
}
