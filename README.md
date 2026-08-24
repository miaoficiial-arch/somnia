# 🌙 Somnia — diario de sueños

Este proyecto es el prototipo funcional inicial de Somnia: interfaz nocturna, navegación, registro de sueño, historial, patrones, perfil y preparación para autenticación/IA.

## Qué está incluido

- Landing de Somnia.
- Registro y login en modo prototipo.
- Pantalla de verificación.
- Dashboard responsive.
- Registro de sueño.
- Campos de emociones, descanso, consumo previo y estrés.
- Historial.
- Patrones.
- Perfil y permisos de IA.
- Preparación de Supabase y OpenAI mediante variables de entorno.

## Ejecutarlo en Windows

Necesitas Node.js instalado.

1. Abre PowerShell dentro de esta carpeta.
2. Ejecuta:

```powershell
npm install
npm run dev
```

3. Abre http://localhost:3000

## Para convertirlo en una aplicación real

El siguiente trabajo es conectar:

1. Supabase Auth para registro, login y verificación de email.
2. PostgreSQL/Supabase para guardar sueños.
3. Row Level Security para que cada usuario solo pueda acceder a sus propios datos.
4. Una ruta backend segura para la IA. La clave de OpenAI NO debe ponerse en el navegador.
5. Almacenamiento y exportación/borrado de datos.
6. PWA para instalar Somnia en iPhone.
7. Despliegue en Vercel.

El prototipo contiene textos y estadísticas de demostración; no deben interpretarse como datos reales.
