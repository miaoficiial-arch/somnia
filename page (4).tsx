"use client";
import { useState } from "react";
export default function Login() {
 const [error,setError]=useState("");
 return <main className="somnia-shell"><div className="container" style={{paddingTop:50}}><div className="card" style={{maxWidth:520,margin:"0 auto"}}>
 <h1>Bienvenido/a de nuevo</h1><p className="muted">Accede a tu diario.</p>
 <form onSubmit={(e)=>{e.preventDefault();setError("Demo local: conecta Supabase para activar el inicio de sesión real.")}}>
 <div className="field"><label>Correo electrónico</label><input type="email" required /></div>
 <div className="field"><label>Contraseña</label><input type="password" required /></div>
 <button className="btn">Iniciar sesión</button></form>
 {error && <p className="error">{error}</p>}<p className="muted" style={{marginTop:20}}><a href="/registro">Crear cuenta</a> · ¿Has olvidado tu contraseña?</p>
 </div></div></main>
}