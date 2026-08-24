"use client";
import { useState } from "react";

export default function Registro() {
  const [sent, setSent] = useState(false);
  return <main className="somnia-shell"><div className="container" style={{paddingTop:50}}>
    <div className="card" style={{maxWidth:520,margin:"0 auto"}}>
      <h1>Crear una cuenta</h1><p className="muted">Empieza tu diario de sueños.</p>
      {!sent ? <form onSubmit={(e)=>{e.preventDefault();setSent(true)}}><div className="field"><label>Nombre o alias</label><input required /></div><div className="field"><label>Correo electrónico</label><input type="email" required /></div><div className="field"><label>Contraseña</label><input type="password" required minLength={8} /></div><div className="field"><label>Confirmar contraseña</label><input type="password" required minLength={8} /></div><p className="muted">Al continuar se enviará un correo de verificación.</p><button className="btn" type="submit">Crear cuenta</button></form> : <div><div className="moon" style={{margin:"30px auto"}}/><h2>Comprueba tu correo</h2><p className="muted">Hemos preparado la verificación de cuenta. En la versión conectada a Supabase, el enlace llegará a tu correo.</p><a className="btn" href="/verificada">Continuar</a></div>}
    </div></div></main>
}