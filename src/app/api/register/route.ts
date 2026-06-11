import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Datos invalidos." },
      { status: 400 },
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existingUser) {
    return NextResponse.json(
      { message: "Ya existe una cuenta con este email." },
      { status: 409 },
    );
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashedPassword,
      role: parsed.data.role,
      professionalArea:
        parsed.data.role === "FREELANCER"
          ? parsed.data.professionalArea
          : null,
      country: parsed.data.role === "FREELANCER" ? parsed.data.country : null,
      companyName:
        parsed.data.role === "CLIENT" && parsed.data.companyName
          ? parsed.data.companyName
          : null,
    },
  });

  return NextResponse.json(
    { message: "Usuario registrado correctamente." },
    { status: 201 },
  );
}
