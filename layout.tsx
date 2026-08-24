import "./globals.css";

export const metadata = {
  title: "Somnia — Tu diario de sueños",
  description: "Registra, recuerda y explora tus sueños.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}