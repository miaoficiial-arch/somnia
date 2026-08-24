"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase/client";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  }

  return (
    <main className="somnia-shell">
      <div className="container" style={{ paddingTop: 50 }}>
        <div
          className="card"
          style={{ maxWidth: 520, margin: "0 auto" }}
        >
          {!sent ? (
            <>
              <h1>Crear una cuenta</h1>

              <p className="muted">
                Empieza tu diario de sueños.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label>Nombre o alias</label>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label>Correo electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>

                <div className="field">
                  <label>Confirmar contraseña</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    required
                    minLength={8}
                  />
                </div>

                {error && (
                  <p style={{ color: "crimson" }}>
                    {error}
                  </p>
                )}

                <p className="muted">
                  Al crear la cuenta recibirás un correo de
                  verificación.
                </p>

                <button
                  className="btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creando cuenta..." : "Crear cuenta"}
                </button>
              </form>
            </>
          ) : (
            <div>
              <div
                className="moon"
                style={{ margin: "30px auto" }}
              />

              <h2>Comprueba tu correo</h2>

              <p className="muted">
                Hemos creado tu cuenta. Revisa tu correo
                electrónico y pulsa el enlace de verificación
                que te ha enviado Somnia.
              </p>

              <a className="btn" href="/verificada">
                Continuar
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
