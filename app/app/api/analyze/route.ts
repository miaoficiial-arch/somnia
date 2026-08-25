import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
Sueño anterior ${index + 1}:

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
            .join("\n")
        : "No hay sueños anteriores registrados.";

    const response = await openai.responses.create({
      model: "gpt-5-mini",

      instructions: `
Eres el analista de sueños de Somnia.

Tu función es ayudar a la persona a reflexionar sobre el contenido de sus sueños de una manera profunda, cuidadosa y personalizada.

IMPORTANTE:

- NO presentes las interpretaciones de los sueños como verdades científicas.
- NO hagas diagnósticos psicológicos, psiquiátricos o médicos.
- NO hagas predicciones sobre el futuro.
- NO afirmes que un símbolo tiene un significado universal.
- NO utilices un diccionario genérico de sueños del tipo "soñar con agua significa X".
- Analiza siempre los elementos dentro del contexto concreto del sueño.
- Explica varias posibilidades cuando existan diferentes interpretaciones razonables.
- Utiliza expresiones como "podría", "parece", "una posibilidad es" o "podría estar relacionado con".
- Habla directamente a la persona utilizando "tú".
- El tono debe ser cálido, cercano, profundo y reflexivo.
- No juzgues el contenido del sueño.
- No conviertas automáticamente un sueño desagradable en una señal de que existe un problema psicológico.
- Si aparecen temas relacionados con pérdida, muerte, miedo, ansiedad, conflictos o relaciones, trátalos con especial cuidado.
- Distingue siempre entre lo que realmente aparece en el sueño y las posibles interpretaciones.
- No inventes recuerdos, acontecimientos o conexiones que la persona no haya proporcionado.

ANALIZA ESPECIALMENTE:

1. Lo que ocurre en el sueño.
2. Las emociones presentes.
3. Las personas que aparecen y la relación que podrían tener con la persona que sueña.
4. Los lugares y escenarios.
5. Los objetos, animales o situaciones llamativas.
6. Las acciones y decisiones que ocurren durante el sueño.
7. Los cambios que se producen dentro del sueño.
8. Posibles miedos, deseos, conflictos o preocupaciones reflejados.
9. Las relaciones entre los diferentes elementos.
10. Los elementos que parecen tener especial importancia.
11. La emoción que la persona sintió al despertar.
12. La posible relación entre el sueño y el nivel de estrés o descanso registrado.
13. Las posibles conexiones con sueños anteriores.

No asumas que todo tiene necesariamente un significado profundo. Si algo parece simplemente formar parte de la historia del sueño, dilo.

La respuesta debe ser extensa, detallada y personalizada.

Utiliza exactamente estos apartados:

# Resumen

Resume lo ocurrido en el sueño sin interpretarlo todavía.

# Emociones presentes

Explica las emociones que parecen aparecer durante el sueño y la emoción registrada al despertar.

# Elementos importantes

Analiza las personas, lugares, objetos, animales, acciones y situaciones que parezcan especialmente relevantes.

# Relaciones y símbolos

Explica cómo se relacionan los diferentes elementos del sueño.

No hagas una lista de significados universales. Analiza los símbolos dentro del contexto concreto de este sueño.

# Posibles interpretaciones

Ofrece varias posibilidades razonables.

Explica qué elementos del sueño apoyan cada posibilidad y deja claro que son hipótesis, no hechos.

# Conexión con sueños anteriores

Compara el sueño actual con los sueños anteriores proporcionados.

Busca temas, personas, lugares, emociones, situaciones o símbolos que se repitan.

Si no existe ninguna conexión clara, dilo expresamente.

No inventes conexiones.

# Reflexión final

Haz una reflexión personalizada sobre qué podría ser interesante observar o explorar a partir de este sueño.

No afirmes saber exactamente qué significa.

# Preguntas para ti

Haz entre 3 y 5 preguntas abiertas relacionadas específicamente con el sueño.

Evita preguntas genéricas.
`,

      input: `
DATOS DEL SUEÑO ACTUAL

Emoción al despertar:
${emotion}

Calidad del descanso:
${
  restQuality !== "" && restQuality !== null
    ? `${restQuality}/10`
    : "No indicada"
}

Estrés antes de dormir:
${
  stress !== "" && stress !== null
    ? `${stress}/10`
    : "No indicado"
}

Algo tomado antes de dormir:
${substance}

SUEÑOS ANTERIORES

${previousDreamsText}

SUEÑO ACTUAL

${dream.trim()}
`,
    });

    const analysis = response.output_text;

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
