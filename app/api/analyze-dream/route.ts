import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
- Usa un tono cálido, reflexivo, cercano y profundo.
- No utilices interpretaciones genéricas de diccionario.
- Analiza el sueño teniendo en cuenta el contexto concreto de lo que cuenta la persona.
- Cuando existan varias interpretaciones posibles, explícalas.
- Presta especial atención a las emociones, relaciones, conflictos, cambios, miedos, deseos y elementos que se repiten.
- Si hay sueños anteriores, compáralos y busca posibles conexiones.

EMOCIÓN AL DESPERTAR:
${emotion || "No indicada"}

SUEÑOS ANTERIORES:
${
  previousDreams.length > 0
    ? previousDreams
        .map((d: any) => "- " + d.dream)
        .join("\n")
    : "Ninguno"
}

SUEÑO ACTUAL:
${dream}

Devuelve el análisis con estos apartados exactamente:

# Resumen

Explica de forma clara qué ocurre en el sueño y cuáles parecen ser sus elementos principales.

# Emociones presentes

Analiza las emociones que aparecen en el sueño y cómo pueden relacionarse con lo que ocurre.

# Elementos importantes

Analiza las personas, lugares, objetos, acciones y situaciones que parecen especialmente relevantes.

# Relaciones y símbolos

Explica posibles significados simbólicos de los elementos, pero siempre teniendo en cuenta el contexto concreto del sueño y dejando claro que son posibilidades.

# Posibles interpretaciones

Haz un análisis profundo de qué podría estar reflejando el sueño a nivel emocional o personal. Relaciona los diferentes elementos entre sí.

# Conexión con sueños anteriores

Si existen sueños anteriores, compara elementos, emociones, personas, lugares o situaciones que puedan repetirse. Si no existen, indica que todavía no hay suficientes sueños para establecer conexiones.

# Reflexión final

Ofrece una reflexión personalizada sobre lo que podría invitar a observar este sueño.

# Preguntas para ti

Termina con entre 3 y 5 preguntas que ayuden a la persona a reflexionar sobre su propio sueño y sobre posibles conexiones con su vida actual.
`;

    const response = await openai.responses.create({
      model: "gpt-5",
      input: prompt,
    });

    return NextResponse.json({
      analysis: response.output_text,
    });
  } catch (error) {
    console.error("Error analizando el sueño:", error);

    return NextResponse.json(
      { error: "Error analizando el sueño." },
      { status: 500 }
    );
  }
}
