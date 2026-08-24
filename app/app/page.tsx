"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase/client";

type Dream = {
  id: number;
  created_at: string;
  user_id: string;
  dream: string;
  emotion: string | null;
  rest_quality: number | null;
  substance: string | null;
  stress: number | null;
};

const EMOTIONS = [
  "Tranquilo/a",
  "Asustado/a",
  "Triste",
  "Ansioso/a",
  "Feliz",
  "Confuso/a",
];

const SUBSTANCES = [
  "Nada",
  "Infusión",
  "Café",
  "Melatonina",
  "Medicamento",
  "Alcohol",
  "Cannabis",
  "Otra sustancia",
];

const patternWords = [
  {
    name: "Agua",
    words: [
      "agua",
      "mar",
      "piscina",
      "río",
      "rio",
      "lluvia",
      "océano",
      "oceano",
      "playa",
    ],
  },
  {
    name: "Casa",
    words: [
      "casa",
      "habitación",
      "habitacion",
      "piso",
      "salón",
      "salon",
      "cocina",
      "puerta",
    ],
  },
  {
    name: "Familia",
    words: [
      "madre",
      "padre",
      "mamá",
      "mama",
      "papá",
      "papa",
      "familia",
      "hermano",
      "hermana",
      "abuela",
      "abuelo",
      "hijo",
      "hija",
    ],
  },
  {
    name: "Perderse",
    words: [
      "perdido",
      "perdida",
      "perderme",
      "perderse",
      "no encontraba",
      "no sabía dónde",
      "no sabia donde",
      "extraviado",
    ],
  },
  {
    name: "Caer",
    words: [
      "caía",
      "caia",
      "caer",
      "caí",
      "cai",
      "caída",
      "caida",
      "precipicio",
    ],
  },
  {
    name: "Volar",
    words: [
      "volaba",
      "volar",
      "volando",
      "vuelo",
      "volé",
      "vole",
    ],
  },
  {
    name: "Personas",
    words: [
      "persona",
      "personas",
      "gente",
      "alguien",
      "amigo",
      "amiga",
      "chico",
      "chica",
      "hombre",
      "mujer",
    ],
  },
  {
    name: "Animales",
    words: [
      "perro",
      "gato",
      "caballo",
      "animal",
      "pájaro",
      "pajaro",
      "serpiente",
      "pez",
      "lobo",
      "conejo",
    ],
  },
  {
    name: "Viajes",
    words: [
      "viaje",
      "viajar",
      "avión",
      "avion",
      "tren",
      "autobús",
      "autobus",
      "coche",
      "carretera",
      "maleta",
    ],
  },
  {
    name: "Escuela / estudios",
    words: [
      "escuela",
      "colegio",
      "instituto",
      "universidad",
      "clase",
      "profesor",
      "profesora",
      "examen",
      "estudiar",
    ],
  },
  {
    name: "Muerte",
    words: [
      "muerte",
      "morir",
      "muerto",
      "muerta",
      "fallecido",
      "fallecida",
      "funeral",
      "cementerio",
      "entierro",
    ],
  },
];

export default function App() {
  const [tab, setTab] = useState("inicio");

  const [dream, setDream] = useState("");
  const [emotion, setEmotion] = useState("Tranquilo/a");
  const [restQuality, setRestQuality] = useState("");
  const [substance, setSubstance] = useState("Nada");
  const [stress, setStress] = useState("");

  const [dreams, setDreams] = useState<Dream[]>([]);
  const [saved, setSaved] = useState(false);
  const [analyze, setAnalyze] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadDreams() {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("No hay una sesión iniciada.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("dreams")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setError("No se han podido cargar tus sueños.");
    } else {
      setDreams(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadDreams();
  }, []);

  async function saveDream() {
    setError("");
    setSaved(false);

    if (!dream.trim()) {
      setError("Escribe primero lo que recuerdes del sueño.");
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Tu sesión ha caducado. Vuelve a iniciar sesión.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("dreams").insert({
      user_id: user.id,
      dream: dream.trim(),
      emotion,
      rest_quality:
        restQuality === "" ? null : Number(restQuality),
      substance,
      stress: stress === "" ? null : Number(stress),
    });

    if (error) {
      console.error(error);
      setError("No se ha podido guardar el sueño.");
      setSaving(false);
      return;
    }

    setDream("");
    setEmotion("Tranquilo/a");
    setRestQuality("");
    setSubstance("Nada");
    setStress("");
    setSaved(true);
    setSaving(false);

    await loadDreams();
  }

  const now = new Date();

  const dreamsThisMonth = dreams.filter((d) => {
    const date = new Date(d.created_at);

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  const restValues = dreams
    .map((d) => d.rest_quality)
    .filter((value): value is number => value !== null);

  const averageRest =
    restValues.length > 0
      ? (
          restValues.reduce((sum, value) => sum + value, 0) /
          restValues.length
        ).toFixed(1)
      : "—";

  const averageStress =
    dreams.filter((d) => d.stress !== null).length > 0
      ? (
          dreams
            .filter((d) => d.stress !== null)
            .reduce((sum, d) => sum + (d.stress || 0), 0) /
          dreams.filter((d) => d.stress !== null).length
        ).toFixed(1)
      : "—";

  const emotionCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    dreams.forEach((d) => {
      if (d.emotion) {
        counts[d.emotion] = (counts[d.emotion] || 0) + 1;
      }
    });

    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [dreams]);

  const substanceCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    dreams.forEach((d) => {
      if (d.substance && d.substance !== "Nada") {
        counts[d.substance] = (counts[d.substance] || 0) + 1;
      }
    });

    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [dreams]);

  const recurringPatterns = useMemo(() => {
    return patternWords
      .map((pattern) => {
        let count = 0;

        dreams.forEach((d) => {
          const text = d.dream.toLowerCase();

          const found = pattern.words.some((word) =>
            text.includes(word)
          );

          if (found) {
            count++;
          }
        });

        return {
          name: pattern.name,
          count,
        };
      })
      .filter((pattern) => pattern.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [dreams]);

  const patternDetails = useMemo(() => {
    return recurringPatterns.map((pattern) => {
      const relatedDreams = dreams.filter((d) => {
        const text = d.dream.toLowerCase();

        return patternWords
          .find((p) => p.name === pattern.name)
          ?.words.some((word) => text.includes(word));
      });

      const relatedEmotions: Record<string, number> = {};

      relatedDreams.forEach((d) => {
        if (d.emotion) {
          relatedEmotions[d.emotion] =
            (relatedEmotions[d.emotion] || 0) + 1;
        }
      });

      const mostCommonEmotion =
        Object.entries(relatedEmotions).sort(
          (a, b) => b[1] - a[1]
        )[0];

      return {
        ...pattern,
        relatedDreams,
        mostCommonEmotion,
      };
    });
  }, [dreams, recurringPatterns]);

  const strongestEmotion = emotionCounts[0];

  const highestStressDream = useMemo(() => {
    return dreams
      .filter((d) => d.stress !== null)
      .sort(
        (a, b) =>
          (b.stress || 0) - (a.stress || 0)
      )[0];
  }, [dreams]);

  const patternSummary = useMemo(() => {
    if (dreams.length === 0) {
      return "Todavía no hay suficientes datos para encontrar patrones.";
    }

    if (dreams.length === 1) {
      const parts: string[] = [];

      if (recurringPatterns.length > 0) {
        parts.push(
          `En tu sueño aparece ${
            recurringPatterns.length === 1
              ? "un tema"
              : `${recurringPatterns.length} temas`
          } que Somnia puede seguir observando.`
        );
      }

      if (strongestEmotion) {
        parts.push(
          `La emoción registrada fue ${strongestEmotion[0]}.`
        );
      }

      return (
        parts.join(" ") +
        " Con más sueños podremos comparar estos elementos y detectar relaciones."
      );
    }

    const parts: string[] = [];

    if (recurringPatterns.length > 0) {
      const mainPattern = recurringPatterns[0];

      parts.push(
        `El tema que más se repite es ${mainPattern.name}, presente en ${mainPattern.count} ${
          mainPattern.count === 1 ? "sueño" : "sueños"
        }.`
      );
    }

    if (strongestEmotion) {
      parts.push(
        `Tu emoción más frecuente es ${strongestEmotion[0]}, registrada ${strongestEmotion[1]} ${
          strongestEmotion[1] === 1 ? "vez" : "veces"
        }.`
      );
    }

    return parts.join(" ");
  }, [dreams, recurringPatterns, strongestEmotion]);

  return (
    <main className="somnia-shell dashboard">
      <div className="container">

        <nav className="nav">
          <div className="logo">SOMNIA</div>
          <span className="muted">
            Tu diario de sueños
          </span>
        </nav>

        {tab === "inicio" && (
          <>
            <h2>Buenos días</h2>

            <p className="muted">
              ¿Has soñado esta noche?
            </p>

            <div
              className="card"
              style={{ margin: "22px 0" }}
            >
              <h3>Registrar un sueño</h3>

              <p className="muted">
                Escribe todo lo que recuerdes antes de que se escape.
              </p>

              <button
                className="btn"
                onClick={() => setTab("registrar")}
              >
                ＋ Registrar sueño
              </button>
            </div>

            <div className="grid grid3">

              <div className="card">
                <div className="muted">
                  Sueños este mes
                </div>

                <div className="stat">
                  {dreamsThisMonth}
                </div>
              </div>

              <div className="card">
                <div className="muted">
                  Temas recurrentes
                </div>

                <div className="stat">
                  {recurringPatterns.length}
                </div>
              </div>

              <div className="card">
                <div className="muted">
                  Descanso medio
                </div>

                <div className="stat">
                  {averageRest}
                </div>
              </div>

            </div>
          </>
        )}

        {tab === "registrar" && (
          <div className="card">

            <h2>Registrar sueño</h2>

            <p className="muted">
              Paso 1 de 6 · ¿Qué has soñado?
            </p>

            <div className="field">

              <textarea
                value={dream}
                onChange={(e) =>
                  setDream(e.target.value)
                }
                placeholder="Escribe todo lo que recuerdes. No importa si no tiene sentido."
              />

            </div>

            <div className="grid grid2">

              <div className="field">

                <label>
                  ¿Cómo te sentías?
                </label>

                <select
                  value={emotion}
                  onChange={(e) =>
                    setEmotion(e.target.value)
                  }
                >
                  {EMOTIONS.map((item) => (
                    <option key={item}>
                      {item}
                    </option>
                  ))}
                </select>

              </div>

              <div className="field">

                <label>
                  Calidad del descanso (0–10)
                </label>

                <input
                  type="number"
                  min="0"
                  max="10"
                  value={restQuality}
                  onChange={(e) =>
                    setRestQuality(e.target.value)
                  }
                />

              </div>

            </div>

            <div className="grid grid2">

              <div className="field">

                <label>
                  ¿Tomaste algo antes de dormir?
                </label>

                <select
                  value={substance}
                  onChange={(e) =>
                    setSubstance(e.target.value)
                  }
                >
                  {SUBSTANCES.map((item) => (
                    <option key={item}>
                      {item}
                    </option>
                  ))}
                </select>

              </div>

              <div className="field">

                <label>
                  Estrés antes de dormir (0–10)
                </label>

                <input
                  type="number"
                  min="0"
                  max="10"
                  value={stress}
                  onChange={(e) =>
                    setStress(e.target.value)
                  }
                />

              </div>

            </div>

            {error && (
              <p style={{ color: "crimson" }}>
                {error}
              </p>
            )}

            <div
              className="actions"
              style={{
                justifyContent: "flex-start",
              }}
            >

              <button
                className="btn"
                onClick={saveDream}
                disabled={saving}
              >
                {saving
                  ? "Guardando..."
                  : "Guardar sueño"}
              </button>

              <button
                className="btn secondary"
                onClick={() =>
                  setAnalyze(true)
                }
              >
                Analizar con IA
              </button>

            </div>

            {saved && (
              <p className="success">
                ¡Sueño guardado correctamente!
              </p>
            )}

            {analyze && (
              <div
                className="card"
                style={{ marginTop: 18 }}
              >

                <h3>
                  ✦ Análisis de ejemplo
                </h3>

                <p>
                  La IA podrá analizar los temas,
                  emociones y posibles relaciones
                  entre tus sueños.
                </p>

                <span className="badge">
                  Posibles temas
                </span>

                <span className="badge">
                  Emociones
                </span>

                <span className="badge">
                  Factores de sueño
                </span>

              </div>
            )}

          </div>
        )}

        {tab === "historial" && (
          <>
            <h2>Historial</h2>

            <p className="muted">
              Todos tus sueños, organizados por fecha.
            </p>

            {loading ? (
              <div className="card">
                <p className="muted">
                  Cargando tus sueños...
                </p>
              </div>
            ) : dreams.length === 0 ? (
              <div
                className="card"
                style={{ marginTop: 16 }}
              >

                <h3>
                  Aún no tienes sueños registrados
                </h3>

                <p className="muted">
                  Cuando registres tu primer sueño
                  aparecerá aquí.
                </p>

                <button
                  className="btn"
                  onClick={() =>
                    setTab("registrar")
                  }
                >
                  ＋ Registrar mi primer sueño
                </button>

              </div>
            ) : (
              dreams.map((d) => (
                <div
                  className="card"
                  key={d.id}
                  style={{ margin: "12px 0" }}
                >

                  <b>
                    {new Date(
                      d.created_at
                    ).toLocaleDateString(
                      "es-ES",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </b>

                  <p>{d.dream}</p>

                  {d.emotion && (
                    <span className="badge">
                      {d.emotion}
                    </span>
                  )}

                  {d.rest_quality !== null && (
                    <span className="badge">
                      Descanso: {d.rest_quality}/10
                    </span>
                  )}

                  {d.stress !== null && (
                    <span className="badge">
                      Estrés: {d.stress}/10
                    </span>
                  )}

                  {d.substance &&
                    d.substance !== "Nada" && (
                      <span className="badge">
                        {d.substance}
                      </span>
                    )}

                </div>
              ))
            )}
          </>
        )}

        {tab === "patrones" && (
          <>
            <h2>Mis patrones</h2>

            <p className="muted">
              Descubre qué se repite en tus sueños.
            </p>

            {dreams.length === 0 ? (
              <div className="card">

                <h3>
                  Todavía no tenemos sueños suficientes
                </h3>

                <p className="muted">
                  Registra algunos sueños y Somnia
                  empezará a detectar temas,
                  emociones y hábitos que se repiten.
                </p>

                <button
                  className="btn"
                  onClick={() =>
                    setTab("registrar")
                  }
                >
                  ＋ Registrar sueño
                </button>

              </div>
            ) : (
              <>

                <div className="card">

                  <h3>
                    Elementos recurrentes
                  </h3>

                  {recurringPatterns.length === 0 ? (
                    <p className="muted">
                      Todavía no se ha detectado
                      ningún elemento de los que Somnia
                      está siguiendo.
                    </p>
                  ) : (
                    recurringPatterns.map(
                      (pattern) => (
                        <p key={pattern.name}>
                          <strong>
                            {pattern.name}
                          </strong>{" "}
                          · {pattern.count}{" "}
                          {pattern.count === 1
                            ? "sueño"
                            : "sueños"}
                        </p>
                      )
                    )
                  )}

                </div>

                <div
                  className="card"
                  style={{ marginTop: 16 }}
                >

                  <h3>
                    Emociones más frecuentes
                  </h3>

                  {emotionCounts.length === 0 ? (
                    <p className="muted">
                      Todavía no hay emociones registradas.
                    </p>
                  ) : (
                    emotionCounts.map(
                      ([emotionName, count]) => (
                        <p key={emotionName}>
                          <strong>
                            {emotionName}
                          </strong>{" "}
                          · {count}{" "}
                          {count === 1
                            ? "vez"
                            : "veces"}
                        </p>
                      )
                    )
                  )}

                </div>

                <div
                  className="card"
                  style={{ marginTop: 16 }}
                >

                  <h3>
                    Relaciones entre tus sueños
                  </h3>

                  {patternDetails.length === 0 ? (
                    <p className="muted">
                      Todavía no hay elementos suficientes
                      para establecer relaciones.
                    </p>
                  ) : (
                    patternDetails.slice(0, 5).map(
                      (pattern) => (
                        <div
                          key={pattern.name}
                          style={{
                            marginBottom: 18,
                          }}
                        >

                          <p>
                            <strong>
                              {pattern.name}
                            </strong>{" "}
                            aparece en{" "}
                            <strong>
                              {pattern.count}
                            </strong>{" "}
                            {pattern.count === 1
                              ? "sueño"
                              : "sueños"}.
                          </p>

                          {pattern.mostCommonEmotion && (
                            <p className="muted">
                              La emoción más frecuente
                              cuando aparece este tema es{" "}
                              <strong>
                                {
                                  pattern
                                    .mostCommonEmotion[0]
                                }
                              </strong>
                              .
                            </p>
                          )}

                        </div>
                      )
                    )
                  )}

                </div>

                <div
                  className="grid grid2"
                  style={{ marginTop: 16 }}
                >

                  <div className="card">

                    <h3>
                      Descanso
                    </h3>

                    <div className="stat">
                      {averageRest}
                    </div>

                    <p className="muted">
                      Media de calidad del descanso
                    </p>

                  </div>

                  <div className="card">

                    <h3>
                      Estrés
                    </h3>

                    <div className="stat">
                      {averageStress}
                    </div>

                    <p className="muted">
                      Media de estrés antes de dormir
                    </p>

                  </div>

                </div>

                <div
                  className="card"
                  style={{ marginTop: 16 }}
                >

                  <h3>
                    Factores antes de dormir
                  </h3>

                  {substanceCounts.length === 0 ? (
                    <p className="muted">
                      No has registrado sustancias
                      diferentes de "Nada".
                    </p>
                  ) : (
                    substanceCounts.map(
                      ([name, count]) => (
                        <p key={name}>
                          <strong>
                            {name}
                          </strong>{" "}
                          · {count}{" "}
                          {count === 1
                            ? "vez"
                            : "veces"}
                        </p>
                      )
                    )
                  )}

                </div>

                <div
                  className="card"
                  style={{ marginTop: 16 }}
                >

                  <h3>
                    ✦ Lo que Somnia ha detectado
                  </h3>

                  <p>
                    {patternSummary}
                  </p>

                  {dreams.length >= 2 &&
                    highestStressDream &&
                    highestStressDream.stress !== null && (
                      <p className="muted">
                        Tu nivel de estrés más alto
                        registrado hasta ahora ha sido{" "}
                        <strong>
                          {highestStressDream.stress}/10
                        </strong>
                        .
                      </p>
                    )}

                  {dreams.length < 3 && (
                    <p className="muted">
                      Cuantos más sueños registres,
                      más precisas serán las comparaciones.
                    </p>
                  )}

                </div>

              </>
            )}
          </>
        )}

        {tab === "perfil" && (
          <>
            <h2>Mi perfil</h2>

            <div className="card">

              <h3>Cuenta</h3>

              <p className="muted">
                Tu cuenta de Somnia
              </p>

            </div>

            <div
              className="card"
              style={{ marginTop: 16 }}
            >

              <h3>
                Privacidad e IA
              </h3>

              <p>
                Permitir análisis con IA{" "}
                <span className="badge">
                  Configurable
                </span>
              </p>

              <p>
                Comparar sueños anteriores{" "}
                <span className="badge">
                  Configurable
                </span>
              </p>

              <p>
                Usar información sobre descanso
                y emociones{" "}
                <span className="badge">
                  Configurable
                </span>
              </p>

              <p>
                Usar información sobre sustancias{" "}
                <span className="badge">
                  Configurable
                </span>
              </p>

            </div>

            <div
              className="card"
              style={{ marginTop: 16 }}
            >

              <h3>
                Mis datos
              </h3>

              <p>
                Descargar mis datos
              </p>

              <p>
                Eliminar mis sueños
              </p>

              <p>
                Eliminar mi cuenta
              </p>

            </div>

          </>
        )}

        <div className="bottom-nav">

          <button
            className={
              "navitem " +
              (tab === "inicio"
                ? "active"
                : "")
            }
            onClick={() =>
              setTab("inicio")
            }
          >
            ⌂ Inicio
          </button>

          <button
            className={
              "navitem " +
              (tab === "historial"
                ? "active"
                : "")
            }
            onClick={() =>
              setTab("historial")
            }
          >
            ☾ Historial
          </button>

          <button
            className={
              "navitem " +
              (tab === "patrones"
                ? "active"
                : "")
            }
            onClick={() =>
              setTab("patrones")
            }
          >
            ✦ Patrones
          </button>

          <button
            className={
              "navitem " +
              (tab === "perfil"
                ? "active"
                : "")
            }
            onClick={() =>
              setTab("perfil")
            }
          >
            ♙ Perfil
          </button>

        </div>

      </div>
    </main>
  );
}
```
