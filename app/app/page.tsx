"use client";
import { useState } from "react";

const dreams = [
 {date:"23 AGO", title:"Estaba caminando por un lugar que no reconocía...", tags:["ansiedad","agua"]},
 {date:"22 AGO", title:"Mi antigua casa aparecía completamente vacía...", tags:["familia","casa"]},
 {date:"20 AGO", title:"Soñé que no podía llegar a un sitio...", tags:["pesadilla","perderse"]}
];

export default function App() {
 const [tab,setTab]=useState("inicio");
 const [dream,setDream]=useState("");
 const [saved,setSaved]=useState(false);
 const [analyze,setAnalyze]=useState(false);

 return <main className="somnia-shell dashboard"><div className="container">
 <nav className="nav"><div className="logo">SOMNIA</div><span className="muted">Tu diario de sueños</span></nav>

 {tab==="inicio" && <><h2>Buenos días</h2><p className="muted">¿Has soñado esta noche?</p>
 <div className="card" style={{margin:"22px 0"}}><h3>Registrar un sueño</h3><p className="muted">Escribe todo lo que recuerdes antes de que se escape.</p><button className="btn" onClick={()=>setTab("registrar")}>＋ Registrar sueño</button></div>
 <div className="grid grid3"><div className="card"><div className="muted">Sueños este mes</div><div className="stat">12</div></div><div className="card"><div className="muted">Sueños recurrentes</div><div className="stat">3</div></div><div className="card"><div className="muted">Descanso medio</div><div className="stat">6,8</div></div></div>
 </>}

 {tab==="registrar" && <div className="card"><h2>Registrar sueño</h2><p className="muted">Paso 1 de 6 · ¿Qué has soñado?</p><div className="field"><textarea value={dream} onChange={e=>setDream(e.target.value)} placeholder="Escribe todo lo que recuerdes. No importa si no tiene sentido." /></div><div className="grid grid2"><div className="field"><label>¿Cómo te sentías?</label><select><option>Tranquilo/a</option><option>Asustado/a</option><option>Triste</option><option>Ansioso/a</option><option>Feliz</option><option>Confuso/a</option></select></div><div className="field"><label>Calidad del descanso (0–10)</label><input type="number" min="0" max="10" /></div></div><div className="grid grid2"><div className="field"><label>¿Tomaste algo antes de dormir?</label><select><option>Nada</option><option>Infusión</option><option>Café</option><option>Melatonina</option><option>Medicamento</option><option>Alcohol</option><option>Cannabis</option><option>Otra sustancia</option></select></div><div className="field"><label>Estrés antes de dormir (0–10)</label><input type="number" min="0" max="10" /></div></div><div className="actions" style={{justifyContent:"flex-start"}}><button className="btn" onClick={()=>{setSaved(true);setAnalyze(false)}}>Guardar sueño</button><button className="btn secondary" onClick={()=>setAnalyze(true)}>Analizar con IA</button></div>{saved&&<p className="success">Sueño guardado en este prototipo.</p>}{analyze&&<div className="card" style={{marginTop:18}}><h3>✦ Análisis de ejemplo</h3><p>La IA podría explorar posibles temas, emociones y factores relacionados con el descanso. En la versión conectada, este análisis se generará usando la API configurada y solo con los permisos que concedas.</p><span className="badge">Posibles temas</span><span className="badge">Emociones</span><span className="badge">Factores de sueño</span></div>}</div>}

 {tab==="historial" && <><h2>Historial</h2><p className="muted">Todos tus sueños, organizados por fecha.</p>{dreams.map((d,i)=><div className="card" key={i} style={{margin:"12px 0"}}><b>{d.date}</b><p>{d.title}</p>{d.tags.map(t=><span className="badge" key={t}>#{t}</span>)}</div>)}</>}

 {tab==="patrones" && <><h2>Mis patrones</h2><p className="muted">Una visión de lo que se repite en tus sueños.</p><div className="grid grid2"><div className="card"><h3>Elementos recurrentes</h3><p>Agua · 8 sueños</p><p>Familia · 6 sueños</p><p>Casa · 5 sueños</p><p>Perderse · 5 sueños</p></div><div className="card"><h3>Emociones</h3><p>Ansiedad · 42%</p><p>Miedo · 25%</p><p>Tranquilidad · 18%</p><p>Felicidad · 15%</p></div></div><div className="card" style={{marginTop:16}}><h3>✦ Lo que Somnia ha detectado</h3><p className="muted">En una versión conectada, la IA comparará tus sueños y buscará patrones recurrentes respetando tus permisos de privacidad.</p></div></>}

 {tab==="perfil" && <><h2>Mi perfil</h2><div className="card"><h3>Cuenta</h3><p className="muted">Usuario de Somnia</p></div><div className="card" style={{marginTop:16}}><h3>Privacidad e IA</h3><p>Permitir análisis con IA <span className="badge">Configurable</span></p><p>Comparar sueños anteriores <span className="badge">Configurable</span></p><p>Usar información sobre descanso y emociones <span className="badge">Configurable</span></p><p>Usar información sobre sustancias <span className="badge">Configurable</span></p></div><div className="card" style={{marginTop:16}}><h3>Mis datos</h3><p>Descargar mis datos</p><p>Eliminar mis sueños</p><p>Eliminar mi cuenta</p></div></>}

 <div className="bottom-nav"><button className={"navitem "+(tab==="inicio"?"active":"")} onClick={()=>setTab("inicio")}>⌂ Inicio</button><button className={"navitem "+(tab==="historial"?"active":"")} onClick={()=>setTab("historial")}>☾ Historial</button><button className={"navitem "+(tab==="patrones"?"active":"")} onClick={()=>setTab("patrones")}>✦ Patrones</button><button className={"navitem "+(tab==="perfil"?"active":"")} onClick={()=>setTab("perfil")}>♙ Perfil</button></div>
 </div></main>
}
