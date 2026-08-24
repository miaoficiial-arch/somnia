"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase/client";

export default function App() {
  const [tab, setTab] = useState("inicio");
  const [dream, setDream] = useState("");
  const [saved, setSaved] = useState(false);
  const [analyze, setAnalyze] = useState(false);

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
                <div className="stat">0</div>
              </div>

              <div className="card">
                <div className="muted">Sueños recurrentes</div>
                <div className="stat">0</div>
              </div>

              <div className="card">
                <div className="muted">Descanso medio</div>
                <div className="stat">—</div>
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
                <select>
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
                <input type="number" min="0" max="10" />
              </div>
            </div>

            <div className="grid grid2">
              <div className="field">
                <label>¿Tomaste algo antes de dormir?</label>
                <select>
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
                <input type="number" min="0" max="10" />
              </div>
            </div>

            <div
              className="actions"
              style={{ justifyContent: "flex-start" }}
            >
              <button
                className="btn"
                onClick={() => {
                  setSaved(true);
                  setAnalyze(false);
                }}
              >
                Guardar sueño
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
                Sueño guardado en este prototipo.
              </p>
            )}

            {analyze && (
              <div
                className="card"
                style={{ marginTop: 18 }}
              >
                <h3>✦ Análisis de ejemplo</h3>
                <p>
                  La IA podría explorar posibles temas,
                  emociones y factores relacionados con el
                  descanso.
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

            <div className="card" style={{ marginTop: 16 }}>
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
          </>
        )}

        {tab === "patrones" && (
          <>
            <h2>Mis patrones</h2>

            <p className="muted">
              Una visión de lo que se repite en tus sueños.
            </p>

            <div className="card">
              <h3>Aún no hay suficientes datos</h3>
              <p className="muted">
                Cuando hayas registrado varios sueños,
                Somnia podrá mostrar elementos y emociones
                recurrentes.
              </p>
            </div>
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
