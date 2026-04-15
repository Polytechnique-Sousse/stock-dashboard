import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = "MY_SECRET_KEY"; // mets ça dans .env après

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // 🔐 créer token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: "1d" }
    );

    // 🍪 stocker dans cookie
    const response = NextResponse.json({ message: "Login success" });

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
    });

    return response;

  } catch (error) {
    return NextResponse.json({ error: "Login error" }, { status: 500 });
  }
}