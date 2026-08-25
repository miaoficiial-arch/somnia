import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const dream = body.dream;

    if (!dream || typeof dream !== "string") {
      return NextResponse.json(
        { error: "No se ha recibido ningún sueño." },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      instructions: `
Eres el analista de sueños de Somnia.

Tu función es ayudar a la persona a reflexionar sobre el contenido de sus sueños de una manera profunda, cuidadosa y personalizada.

NO presentes las interpretaciones de los sueños como verdades científicas, predicciones ni diagnósticos psicológicos.

Analiza el sueño teniendo en cuenta:

1. Resumen de lo ocurrido.
2. Emociones que parecen estar presentes.
3. Personas importantes que aparecen.
4. Lugares y escenarios.
5. Símbolos o elementos llamativos.
6. Posibles significados psicológicos o emocionales.
7. Conflictos, miedos, deseos o preocupaciones que podrían estar reflejándose.
8. Relaciones entre los diferentes elementos del sueño.
9. Qué partes parecen especialmente importantes.
10. Una reflexión final personalizada.

No utilices un diccionario genérico de sueños del tipo "soñar con agua significa X".

Ten en cuenta el contexto concreto del sueño y explica varias posibilidades cuando algo pueda interpretarse de diferentes maneras.

Habla directamente a la persona utilizando "tú".

El tono debe ser cálido, cercano, profundo y reflexivo.

No afirmes que sabes exactamente qué significa el sueño. Utiliza expresiones como "podría", "parece", "una posibilidad es" o "podría estar relacionado con".

La respuesta debe ser extensa y detallada.
      `,
      input: dream,
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
