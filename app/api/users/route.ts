import { NextResponse } from "next/server";

import { adminAuth } from "@lib/firebase-admin";

type PatchPayload = {
  uid: string;
  role?: string;
  permissions?: string[];
};

export async function GET() {
  try {
    const list = await adminAuth.listUsers(1000);

    const users = list.users.map((user) => ({
      uid: user.uid,
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      role: (user.customClaims?.role as string) ?? "visualizador",
      permissions: Array.isArray(user.customClaims?.permissions)
        ? (user.customClaims?.permissions as string[])
        : [],
      lastSignInTime: user.metadata?.lastSignInTime ?? null,
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error("[users:GET]", error);
    return NextResponse.json(
      { error: "Não foi possível buscar usuários." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as PatchPayload;

    if (!body.uid) {
      return NextResponse.json(
        { error: "É necessário informar o usuário." },
        { status: 400 },
      );
    }

    const current = await adminAuth.getUser(body.uid);
    const updatedClaims = {
      ...(current.customClaims ?? {}),
      ...(body.role && { role: body.role }),
      ...(body.permissions && { permissions: body.permissions }),
    };

    await adminAuth.setCustomUserClaims(body.uid, updatedClaims);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[users:PATCH]", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar o usuário." },
      { status: 500 },
    );
  }
}
