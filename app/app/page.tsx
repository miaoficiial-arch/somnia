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

  const averageRest =
    restValues.length > 0
      ? (
          restValues.reduce((sum, value) => sum + value, 0) /
          restValues.length
        ).toFixed(1)
      : "—";

  return (
    <main className="somnia-shell dashboard">
      <div className="container">
        <nav className="nav">
          <div className="logo">SOMNIA</div>
          <span className="muted">Tu diario de sueños</span>
        </nav>

        {tab === "inicio" && (
          <>
            <h2>Buenos días</h2>
            <p className="muted">¿Has soñado esta noche?</p>

            <div className="card" style={{ margin: "22px 0" }}>
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
                <div className="muted">Sueños este mes</div>
                <div className="stat">{dreamsThisMonth}</div>
              </div>

              <div className="card">
                <div className="muted">Sueños recurrentes</div>
                <div className="stat">—</div>
              </div>

              <div className="card">
                <div className="muted">Descanso medio</div>
                <div className="stat">{averageRest}</div>
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
                onChange={(e) => setDream(e.target.value)}
                placeholder="Escribe todo lo que recuerdes. No importa si no tiene sentido."
              />
            </div>

            <div className="grid grid2">
              <div className="field">
                <label>¿Cómo te sentías?</label>

                <select
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value)}
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
                <label>Calidad del descanso (0–10)</label>

                <input
                  type="number"
                  min="0"
                  max="10"
                  value={restQuality}
                  onChange={(e) => setRestQuality(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid2">
              <div className="field">
                <label>¿Tomaste algo antes de dormir?</label>

                <select
                  value={substance}
                  onChange={(e) => setSubstance(e.target.value)}
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
                <label>Estrés antes de dormir (0–10)</label>

                <input
                  type="number"
                  min="0"
                  max="10"
                  value={stress}
                  onChange={(e) => setStress(e.target.value)}
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
              style={{ justifyContent: "flex-start" }}
            >
              <button
                className="btn"
                onClick={saveDream}
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar sueño"}
              </button>

              <button
                className="btn secondary"
                onClick={() => setAnalyze(true)}
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

                <span className="badge">Posibles temas</span>
                <span className="badge">Emociones</span>
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
                <h3>Aún no tienes sueños registrados</h3>

                <p className="muted">
                  Cuando registres tu primer sueño aparecerá
                  aquí.
                </p>

                <button
                  className="btn"
                  onClick={() => setTab("registrar")}
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
                    {new Date(d.created_at).toLocaleDateString(
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

            {dreams.length < 3 ? (
              <div className="card">
                <h3>Aún no hay suficientes datos</h3>

                <p className="muted">
                  Cuando hayas registrado varios sueños,
                  Somnia podrá mostrar elementos y emociones
                  recurrentes.
                </p>
              </div>
            ) : (
              <div className="card">
                <h3>Datos de tus sueños</h3>

                <p>
                  Has registrado {dreams.length} sueños.
                </p>

                <p className="muted">
                  Próximamente podremos analizar
                  automáticamente los patrones.
                </p>
              </div>
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
                Usar información sobre descanso y emociones{" "}
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

              <p>Descargar mis datos</p>
              <p>Eliminar mis sueños</p>
              <p>Eliminar mi cuenta</p>
            </div>
          </>
        )}

        <div className="bottom-nav">
          <button
            className={
              "navitem " +
              (tab === "inicio" ? "active" : "")
            }
            onClick={() => setTab("inicio")}
          >
            ⌂ Inicio
          </button>

          <button
            className={
              "navitem " +
              (tab === "historial" ? "active" : "")
            }
            onClick={() => setTab("historial")}
          >
            ☾ Historial
          </button>

          <button
            className={
              "navitem " +
              (tab === "patrones" ? "active" : "")
            }
            onClick={() => setTab("patrones")}
          >
            ✦ Patrones
          </button>

          <button
            className={
              "navitem " +
              (tab === "perfil" ? "active" : "")
            }
            onClick={() => setTab("perfil")}
          >
            ♙ Perfil
          </button>
        </div>
      </div>
    </main>
  );
}
