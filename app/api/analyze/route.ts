import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

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
Sueño anterior ${index + 1}

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

Ayuda a la persona a reflexionar sobre su sueño de manera profunda, cuidadosa y personalizada.

IMPORTANTE:

- No presentes las interpretaciones como verdades científicas.
- No hagas diagnósticos psicológicos, psiquiátricos o médicos.
- No hagas predicciones sobre el futuro.
- No afirmes que un símbolo tiene un significado universal.
- No utilices diccionarios genéricos de sueños.
- Analiza siempre el sueño dentro de su contexto.
- Ofrece varias posibilidades cuando existan diferentes interpretaciones.
- Utiliza expresiones como "podría", "parece" o "una posibilidad es".
- Habla directamente a la persona utilizando "tú".
- Mantén un tono cálido, cercano, profundo y reflexivo.
- No inventes recuerdos ni acontecimientos.

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

Ofrece varias posibilidades razonables.
Explica qué elementos apoyan cada una y deja claro que son hipótesis.

# Conexión con sueños anteriores

Compara el sueño actual con los sueños anteriores.
Busca temas, personas, lugares, emociones o situaciones que se repitan.
No inventes conexiones.

# Reflexión final

Haz una reflexión personalizada sobre qué podría ser interesante observar o explorar.

# Preguntas para ti

Haz entre 3 y 5 preguntas abiertas relacionadas específicamente con el sueño.

La respuesta debe ser detallada y personalizada.
`;

    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/google/gemma-3-4b-it",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 1200,
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await hfResponse.json();

    if (!hfResponse.ok) {
      console.error("Error de Hugging Face:", data);

      return NextResponse.json(
        {
          error: "La IA no ha podido analizar el sueño.",
          details: data,
        },
        { status: 500 }
      );
    }

    let analysis = "";

    if (Array.isArray(data) && data[0]?.generated_text) {
      analysis = data[0].generated_text;
    } else if (data?.generated_text) {
      analysis = data.generated_text;
    }

    if (!analysis) {
      return NextResponse.json(
        { error: "La IA no ha devuelto ningún análisis." },
        { status: 500 }
      );
    }

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
