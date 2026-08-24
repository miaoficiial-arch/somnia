import Stars from "../components/Stars";

export default function Home() {
  return (
    <main className="somnia-shell">
      <Stars />
      <div className="container">
        <nav className="nav"><div className="logo">SOMNIA</div><span className="muted">Tu diario de sueños</span></nav>
        <section className="hero">
          <div>
            <div className="moon" style={{margin:"0 auto"}} />
            <h1>SOMNIA</h1>
            <p className="tagline">Guarda lo que sueñas. Descubre tus patrones.</p>
            <div className="actions">
              <a className="btn" href="/registro">Crear cuenta</a>
              <a className="btn secondary" href="/login">Iniciar sesión</a>
            </div>
            <p className="muted" style={{marginTop:24}}>Tus sueños son privados.</p>
          </div>
        </section>
      </div>
    </main>
  );
}