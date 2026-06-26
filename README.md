# TaskFlow

Aplicación web de lista de tareas (to-do) con autenticación, persistencia en la nube y despliegue continuo.

## Stack Tecnológico

- **Frontend:** Next.js 16 (App Router, TypeScript, Tailwind CSS)
- **Backend / Auth / DB:** Supabase
- **Deploy:** Vercel

## Requisitos

- Node.js 20.9+
- npm

## Instalación

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Variables de Entorno

Crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto en Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clave anónima de Supabase (pública, segura para el cliente) |

## Estructura del Proyecto

```
src/
├── app/          # Rutas y páginas (App Router)
├── lib/          # Lógica compartida (cliente Supabase, autenticación, CRUD)
supabase/
├── schema.sql    # Esquema de base de datos y políticas RLS
```

## Flujo de trabajo (Git)

- Cada funcionalidad o bug tiene un issue antes de empezar a trabajar.
- Las ramas siguen la convención: `feature/nombre-feature`, `fix/nombre-bug`.
- Ningún cambio se mergea directo a `main`: todo pasa por un Pull Request
  que referencia el issue que resuelve (ej. `closes #12`) y requiere
  aprobación del otro integrante.

## CI/CD

El pipeline corre en GitHub Actions en cada push o PR a `main`:
lint → tests unitarios → tests E2E → build → deploy a Vercel.

**URL de producción:** https://TU-APP.vercel.app  <!-- completar -->

## Autores

- Facundo Jarma
- Manu Szwarc
