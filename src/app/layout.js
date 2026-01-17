import "./globals.css";

export const metadata = {
  title: "BookBeats - AI Music for Reading",
  description: "Generate ambient AI music that fits your book's mood and themes",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1917" }
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
