import { LocaleDocument } from "../components/LocaleDocument";

export default function SpanishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div lang="es">
      <LocaleDocument locale="es" />
      {children}
    </div>
  );
}
