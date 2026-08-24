```tsx
"use client";

import { useEffect, useState } from "react";
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

  const stressValues = dreams
    .map((d) => d.stress)
    .filter((value): value is number => value !== null);

  const averageRest =
    restValues.length > 0
      ? (
          restValues.reduce((sum, value) => sum + value, 0) /
          restValues.length
        ).toFixed(1)
      : "—";

  const averageStress =
    stressValues.length > 0
      ? (
          stressValues.reduce((sum, value) => sum + value, 0) /
          stressValues.length
        ).toFixed(1)
      : "—";

  // EMOCIONES
  const emotionCounts: Record<string, number> = {};

  dreams.forEach((d) => {
    if (d.emotion) {
      emotionCounts[d.emotion] =
        (emotionCounts[d.emotion] || 0) + 1;
    }
  });

  const topEmotions = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1]);

  // SUSTANCIAS
  const substanceCounts: Record<string, number> = {};

  dreams.forEach((d) => {
    if (d.substance && d.substance !== "Nada") {
      substanceCounts[d.substance] =
        (substanceCounts[d.substance] || 0) + 1;
    }
  });

  const topSubstances = Object.entries(substanceCounts)
    .sort((a, b) => b[1] - a[1]);

  // PALABRAS RECURRENTES
  const stopWords = new Set([
    "que",
    "de",
    "la",
    "el",
    "y",
    "en",
    "un",
    "una",
    "por",
    "con",
    "me",
    "mi",
    "se",
    "a",
    "del",
    "los",
    "las",
    "es",
    "era",
    "estaba",
    "había",
    "muy",
    "como",
    "al",
    "lo",
    "no",
    "más",
    "pero",
    "para",
    "yo",
    "su",
    "sin",
    "o",
    "e",
    "fue",
    "son",
  ]);

  const wordCounts: Record<string, number> = {};

  dreams.forEach((d) => {
    const words = d.dream
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .split(/\s+/)
      .filter(
        (word) =>
          word.length >= 4 &&
          !stopWords.has(word)
      );

    words.forEach((word) => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
  });

  const topWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

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
                Escribe todo lo que recuerdes antes de que
                se escape.
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
                  Sueños registrados
                </div>

                <div className="stat">
                  {dreams.length}
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
                  <option>Tranquilo/a</option>
                  <option>Asustado/a</option>
                  <option>Triste</option>
                  <option>Ansioso/a</option>
                  <option>Feliz</option>
                  <option>Confuso/a</option>
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
                  <option>Nada</option>
                  <option>Infusión</option>
                  <option>Café</option>
                  <option>Melatonina</option>
                  <option>Medicamento</option>
                  <option>Alcohol</option>
                  <option>Cannabis</option>
                  <option>Otra sustancia</option>
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

                <h3>✦ Análisis de ejemplo</h3>

                <p>
                  La IA podrá explorar posibles temas,
                  emociones y factores relacionados con
                  el descanso.
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
              Una visión de lo que se repite en tus sueños.
            </p>

            {loading ? (
              <div className="card">
                <p className="muted">
                  Analizando tus sueños...
                </p>
              </div>
            ) : dreams.length === 0 ? (
              <div className="card">
                <h3>Aún no hay sueños</h3>

                <p className="muted">
                  Registra algunos sueños para que Somnia
                  pueda empezar a detectar patrones.
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
                <div className="grid grid2">

                  <div className="card">
                    <h3>🌙 Resumen</h3>

                    <p>
                      Sueños registrados:{" "}
                      <strong>
                        {dreams.length}
                      </strong>
                    </p>

                    <p>
                      Descanso medio:{" "}
                      <strong>
                        {averageRest}/10
                      </strong>
                    </p>

                    <p>
                      Estrés medio:{" "}
                      <strong>
                        {averageStress}/10
                      </strong>
                    </p>
                  </div>

                  <div className="card">
                    <h3>💭 Emociones</h3>

                    {topEmotions.length === 0 ? (
                      <p className="muted">
                        Todavía no hay emociones registradas.
                      </p>
                    ) : (
                      topEmotions
                        .slice(0, 5)
                        .map(([name, count]) => (
                          <p key={name}>
                            <span className="badge">
                              {name}
                            </span>{" "}
                            {count}{" "}
                            {count === 1
                              ? "sueño"
                              : "sueños"}
                          </p>
                        ))
                    )}
                  </div>

                </div>

                <div
                  className="card"
                  style={{ marginTop: 16 }}
                >

                  <h3>🔄 Palabras y temas recurrentes</h3>

                  {topWords.length === 0 ? (
                    <p className="muted">
                      Todavía no hay suficientes palabras
                      para detectar temas.
                    </p>
                  ) : (
                    <>
                      <p className="muted">
                        Estas son algunas de las palabras que
                        más aparecen en tus sueños:
                      </p>

                      {topWords.map(
                        ([word, count]) => (
                          <span
                            className="badge"
                            key={word}
                          >
                            {word} · {count}
                          </span>
                        )
                      )}
                    </>
                  )}

                </div>

                <div className="grid grid2">

                  <div className="card">

                    <h3>😴 Descanso</h3>

                    <p>
                      Media de descanso:{" "}
                      <strong>
                        {averageRest}/10
                      </strong>
                    </p>

                    {averageRest !== "—" && (
                      <p className="muted">
                        Somnia utilizará estos datos para
                        comparar tus sueños con la calidad
                        del descanso.
                      </p>
                    )}

                  </div>

                  <div className="card">

                    <h3>⚡ Estrés</h3>

                    <p>
                      Estrés medio:{" "}
                      <strong>
                        {averageStress}/10
                      </strong>
                    </p>

                    {averageStress !== "—" && (
                      <p className="muted">
                        Con más datos podremos detectar si
                        determinados niveles de estrés aparecen
                        asociados a ciertos sueños.
                      </p>
                    )}

                  </div>

                </div>

                {topSubstances.length > 0 && (
                  <div
                    className="card"
                    style={{ marginTop: 16 }}
                  >

                    <h3>☕ Antes de dormir</h3>

                    <p className="muted">
                      Elementos registrados antes de dormir:
                    </p>

                    {topSubstances.map(
                      ([name, count]) => (
                        <p key={name}>
                          <span className="badge">
                            {name}
                          </span>{" "}
                          {count}{" "}
                          {count === 1
                            ? "vez"
                            : "veces"}
                        </p>
                      )
                    )}

                  </div>
                )}

                <div
                  className="card"
                  style={{ marginTop: 16 }}
                >

                  <h3>✦ Análisis de Somnia</h3>

                  <p className="muted">
                    Estos patrones se calculan directamente
                    a partir de los sueños que tienes
                    registrados. Más adelante podemos añadir
                    inteligencia artificial para realizar un
                    análisis mucho más profundo.
                  </p>

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

              <h3>Privacidad e IA</h3>

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
                Usar información sobre descanso y
                emociones{" "}
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

              <h3>Mis datos</h3>

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
              (tab === "inicio" ? "active" : "")
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
              (tab === "historial" ? "active" : "")
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
              (tab === "patrones" ? "active" : "")
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
              (tab === "perfil" ? "active" : "")
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
