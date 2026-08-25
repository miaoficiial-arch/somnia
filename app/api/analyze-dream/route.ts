import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { dream, emotion, previousDreams = [] } = await req.json();

    if (!dream || dream.trim() === "") {
      return NextResponse.json(
        { error: "No hay ningún sueño para analizar." },
        { status: 400 }
      );
    }

    const prompt = `
Eres Somnia, una IA especializada en análisis profundo de sueños.

IMPORTANTE:

- Nunca afirmes que una interpretación es un hecho.
- No hagas diagnósticos psicológicos ni médicos.
- Habla siempre en español.
- Usa un tono cálido, reflexivo y profundo.
- No te limites a decir qué significa cada símbolo de forma genérica.
- Analiza el sueño como un conjunto.
- Ten en cuenta las emociones, las situaciones, las personas, los lugares y los cambios que aparecen.
- Busca posibles relaciones entre diferentes elementos del sueño.
- Si hay sueños anteriores, compáralos buscando patrones, cambios o elementos que se repitan.
- Diferencia claramente entre lo que aparece en el sueño y las posibles interpretaciones.
- No inventes información que no aparezca en el sueño.

EMOCIÓN AL DESPERTAR:
${emotion || "No indicada"}

SUEÑOS ANTERIORES:
${
  previousDreams.map((d: any) => "- " + d.dream).join("\n") ||
  "Ninguno"
}

SUEÑO ACTUAL:
${dream}

Devuelve el análisis con estos apartados exactamente:

# Resumen

# Emociones presentes

# Elementos importantes

# Relaciones y símbolos

# Posibles interpretaciones

# Conexión con sueños anteriores

# Reflexión final

# Preguntas para ti
`;

    const response = await openai.responses.create({
      model: "gpt-5",
      input: prompt,
    });

    return NextResponse.json({
      analysis: response.output_text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error analizando el sueño." },
      { status: 500 }
    );
  }
}
