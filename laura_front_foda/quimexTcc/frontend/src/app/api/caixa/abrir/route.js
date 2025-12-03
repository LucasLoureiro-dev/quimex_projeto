import { db } from "../../../../lib/db";
import { NextResponse } from "next/server"; // Boa prática usar NextResponse

export async function POST(req) {
  try {
    const { operador, valorInicial } = await req.json();
    
    // Pega a conexão do pool já criado
    const conn = await db();

    const [result] = await conn.query(
      "INSERT INTO caixa_turno (operador, valor_inicial, aberto_em) VALUES (?, ?, NOW())",
      [operador, valorInicial]
    );

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error("Erro ao abrir caixa:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}