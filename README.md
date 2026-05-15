# Serverless App

Aplicación web full-stack serverless con autenticación, base de datos en la nube y despliegue continuo.

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
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase (pública, segura para el cliente) |

## Estructura del Proyecto

```
src/
├── app/          # Rutas y páginas (App Router)
├── lib/          # Lógica compartida (cliente Supabase, autenticación, CRUD)
supabase/
├── schema.sql    # Esquema de base de datos y políticas RLS
```

## Autores

- Facundo Jarma
- Manu Szwarc
