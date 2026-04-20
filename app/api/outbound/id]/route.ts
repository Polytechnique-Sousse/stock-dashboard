import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (auth.error) return auth.error;

  try {
    const { quantity, client, amount, note, date } = await req.json();

    const old = await prisma.outbound.findUnique({ where: { id: Number(params.id) } });
    if (!old) return NextResponse.json({ error: "Not found" });

    const diff = old.quantity - Number(quantity); // stock à remettre

    const [outbound] = await prisma.$transaction([
      prisma.outbound.update({
        where: { id: Number(params.id) },
        data: {
          quantity: Number(quantity),
          client,
          amount: Number(amount),
          note,
          date: date ? new Date(date) : undefined,
        },
        include: { product: { select: { name: true, category: true } } },
      }),
      prisma.product.update({
        where: { id: old.productId },
        data: { stock: { increment: diff } },
      }),
    ]);

    return NextResponse.json(outbound);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (auth.error) return auth.error;

  try {
    const old = await prisma.outbound.findUnique({ where: { id: Number(params.id) } });
    if (!old) return NextResponse.json({ error: "Not found" });

    await prisma.$transaction([
      prisma.outbound.delete({ where: { id: Number(params.id) } }),
      prisma.product.update({
        where: { id: old.productId },
        data: { stock: { increment: old.quantity } },
      }),
    ]);

    return NextResponse.json({ message: "Outbound deleted" });
  } catch {
    return NextResponse.json({ error: "Server error" });
  }
}

function requireAuth(req: NextRequest): { error?: NextResponse } {
    // Add your authentication logic here
    // Return { error: NextResponse.json(...) } on auth failure
    // Return {} on auth success
    return {};
}
