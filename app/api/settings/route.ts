import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "visio-secret-key";

// 🔐 récupérer utilisateur depuis JWT
async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      id?: number;
      email?: string;
    };

    return payload;
  } catch {
    return null;
  }
}

// =======================
// ✅ GET SETTINGS
// =======================
export async function GET() {
  const user = await getCurrentUser();

  if (!user?.id && !user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // récupérer user
    const dbUser = user.id
      ? await prisma.user.findUnique({ where: { id: user.id } })
      : await prisma.user.findFirst({ where: { email: user.email } });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // récupérer settings
    const settings = await prisma.settings.findFirst().catch(() => null);

    return NextResponse.json({
      email: dbUser.email,
      companyName: settings?.companyName ?? "",
      currency: settings?.currency ?? "TND",
      unit: settings?.unit ?? "kg",
      lowStock: settings?.lowStock ?? false,
      emailNotif: settings?.emailNotif ?? false,
    });

  } catch (error) {
    console.error("[SETTINGS GET ERROR]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// =======================
// ✅ SAVE SETTINGS + PASSWORD
// =======================
export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user?.id && !user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      password,
      companyName,
      currency,
      unit,
      lowStock,
      emailNotif,
    } = body;

    // 🔐 UPDATE PASSWORD
    if (password && password.trim().length > 0) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }

      const hashed = await bcrypt.hash(password, 10);

      if (user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashed },
        });
      } else {
        await prisma.user.updateMany({
          where: { email: user.email },
          data: { password: hashed },
        });
      }
    }

    // ⚙️ UPSERT SETTINGS
    const existingSettings = await prisma.settings.findFirst().catch(() => null);

    if (existingSettings) {
      await prisma.settings.update({
        where: { id: existingSettings.id },
        data: {
          companyName: companyName ?? existingSettings.companyName,
          currency: currency ?? existingSettings.currency,
          unit: unit ?? existingSettings.unit,
          lowStock: lowStock ?? existingSettings.lowStock,
          emailNotif: emailNotif ?? existingSettings.emailNotif,
        },
      });
    } else {
      await prisma.settings.create({
        data: {
          companyName: companyName ?? "",
          currency: currency ?? "TND",
          unit: unit ?? "kg",
          lowStock: lowStock ?? false,
          emailNotif: emailNotif ?? false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
    });

  } catch (error) {
    console.error("[SETTINGS POST ERROR]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}