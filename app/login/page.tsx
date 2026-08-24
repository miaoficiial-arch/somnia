"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="somnia-shell">
      <div
        className="container"
        style={{ paddingTop: 50 }}
      >
        <div
          className="card"
          style={{
            maxWidth: 520,
            margin: "0 auto",
          }}
        >
          <h1>Bienvenido/a de nuevo</h1>

          <p className="muted">
            Accede a tu diario.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Correo electrónico</label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            <div className="field">
              <label>Contraseña</label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            {error && (
              <p className="error">
                {error}
              </p>
            )}

            <button
              className="btn"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Iniciando sesión..."
                : "Iniciar sesión"}
            </button>
          </form>

          <p
            className="muted"
            style={{ marginTop: 20 }}
          >
            <a href="/registro">
              Crear cuenta
            </a>{" "}
            · ¿Has olvidado tu contraseña?
          </p>
        </div>
      </div>
    </main>
  );
}
