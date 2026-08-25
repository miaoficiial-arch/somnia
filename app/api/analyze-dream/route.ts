import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const dream = body.dream;
    const emotion = body.emotion || "No indicada";
    const restQuality = body.restQuality ?? "No indicada";
    const stress = body.stress ?? "No indicado";
    const substance = body.substance || "No indicada";

    const previousDreams = Array.isArray(body.previousDreams)
      ? body.previousDreams
      : [];

    if (!dream || typeof dream !== "string" || !dream.trim()) {
      return NextResponse.json(
        { error: "No se ha recibido ningún sueño." },
        { status: 400 }
      );
    }

    const previousDreamsText =
      previousDreams.length > 0
        ? previousDreams
            .slice(0, 10)
            .map(
              (d: any, index: number) => `
Sueño anterior ${index + 1}:

Sueño:
${d.dream || "Sin descripción"}

Emoción:
${d.emotion || "No indicada"}

Calidad del descanso:
${
  d.rest_quality !== null && d.rest_quality !== undefined
    ? `${d.rest_quality}/10`
    : "No indicada"
}

Estrés:
${
  d.stress !== null && d.stress !== undefined
    ? `${d.stress}/10`
    : "No indicado"
}

Sustancia:
${d.substance || "No indicada"}
`
            )
            .join("\n\n")
        : "No hay sueños anteriores registrados.";

    const prompt = `
Eres el analista de sueños de Somnia.

Ayudas a la persona a reflexionar sobre sus sueños de manera profunda,
cuidadosa y personalizada.

IMPORTANTE:

- No presentes las interpretaciones como verdades científicas.
- No hagas diagnósticos psicológicos, psiquiátricos o médicos.
- No hagas predicciones sobre el futuro.
- No afirmes que un símbolo tiene un significado universal.
- No utilices diccionarios genéricos de sueños.
- Analiza siempre el sueño dentro de su contexto concreto.
- Explica varias posibilidades cuando existan diferentes interpretaciones.
- Utiliza expresiones como "podría", "parece" o "una posibilidad es".
- Habla directamente a la persona utilizando "tú".
- Mantén un tono cálido, cercano, profundo y reflexivo.
- No juzgues el contenido del sueño.
- No inventes recuerdos, acontecimientos o conexiones.

DATOS DEL SUEÑO ACTUAL

Emoción al despertar:
${emotion}

Calidad del descanso:
${restQuality}/10

Estrés antes de dormir:
${stress}/10

Algo tomado antes de dormir:
${substance}

SUEÑOS ANTERIORES

${previousDreamsText}

SUEÑO ACTUAL

${dream.trim()}

Utiliza exactamente estos apartados:

# Resumen

Resume lo ocurrido en el sueño sin interpretarlo todavía.

# Emociones presentes

Explica las emociones presentes durante el sueño y la emoción al despertar.

# Elementos importantes

Analiza las personas, lugares, objetos, animales, acciones y situaciones relevantes.

# Relaciones y símbolos

Explica cómo se relacionan los diferentes elementos del sueño.
No utilices significados universales.

# Posibles interpretaciones

Ofrece varias posibilidades razonables y explica qué elementos apoyan cada una.
Deja claro que son hipótesis.

# Conexión con sueños anteriores

Compara el sueño actual con los sueños anteriores y busca temas o elementos
que se repitan. No inventes conexiones.

# Reflexión final

Haz una reflexión personalizada sobre qué podría ser interesante observar o explorar.

# Preguntas para ti

Haz entre 3 y 5 preguntas abiertas relacionadas específicamente con el sueño.

La respuesta debe ser extensa, detallada y personalizada.
`;

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "Qwen/Qwen2.5-72B-Instruct",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 2500,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Error de Hugging Face:", response.status, errorText);

      return NextResponse.json(
        {
          error: "No se ha podido analizar el sueño.",
        },
        { status: 500 }
      );
    }

    const data = await response.json();

    const analysis =
      data?.choices?.[0]?.message?.content ||
      "No se ha recibido ningún análisis.";

    return NextResponse.json({
      analysis,
    });
  } catch (error) {
    console.error("Error analizando sueño:", error);

    return NextResponse.json(
      {
        error: "No se ha podido analizar el sueño.",
      },
      { status: 500 }
    );
  }
}
