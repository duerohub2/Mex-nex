import "./globals.css";

export const metadata = {
  title: "MEX-NEX — AI Virtual Office",
  description: "Kantor virtual AI Agent lokal.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
