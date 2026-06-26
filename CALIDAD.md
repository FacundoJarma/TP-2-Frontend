# CALIDAD.md

> Este documento explica, con nuestras propias palabras, las decisiones que tomamos como equipo
> para asegurar la calidad de TaskFlow. No es un log automático ni una lista de herramientas:
> es el razonamiento detrás de cada decisión.

## 1. Estrategia general

<!--
Qué enfoque eligieron para garantizar calidad y por qué. No alcanza con listar herramientas:
expliquen el razonamiento. Por ejemplo: ¿priorizaron velocidad de desarrollo y agregaron
solo los controles mínimos? ¿Priorizaron que nada roto llegue a producción aunque eso
implique un pipeline más lento? ¿Por qué?
-->

(completar)

## 2. Herramientas seleccionadas

| Propósito       | Herramienta     | Por qué la elegimos                              |
| --------------- | --------------- | ------------------------------------------------- |
| Tests unitarios | Vitest          | (completar: por qué Vitest y no Jest, por ejemplo) |
| Tests E2E       | Playwright      | (completar)                                        |
| Lint            | ESLint          | (completar)                                        |
| CI/CD           | GitHub Actions  | (completar)                                        |
| Deploy          | Vercel          | (completar)                                        |

<!-- Si evaluaron alternativas y las descartaron, mencionarlo acá -->

(completar alternativas evaluadas, si aplica)

## 3. Tests desarrollados

<!--
Listado de los tests implementados con una descripción de qué caso de uso cubre cada uno
y qué comportamiento valida. Ejemplo de formato pedido por la consigna:
"Test E2E: usuario no autenticado es redirigido al login al intentar acceder a /dashboard"
-->

### Tests unitarios

- `tests/unit/tasks.test.ts`
  - **Test:** `isTaskOverdue` devuelve true si la fecha límite ya pasó.
    **Valida:** (completar)
  - **Test:** `getTaskCompletionPercentage` calcula correctamente el porcentaje de tareas completadas.
    **Valida:** (completar)

### Tests E2E

- `tests/e2e/auth-and-tasks.spec.ts`
  - **Test:** usuario no autenticado es redirigido al login al intentar acceder a `/dashboard`.
    **Valida:** (completar)
  - **Test:** usuario puede loguearse y ver su dashboard.
    **Valida:** (completar)
  - **Test:** usuario autenticado puede crear una tarea y verla en la lista.
    **Valida:** (completar)

## 4. Casos de uso críticos

<!--
Cuáles son los flujos de la aplicación que consideran más importantes proteger con tests
y por qué los priorizaron sobre otros.
-->

(completar)

## 5. Pipeline de CI/CD

<!--
Descripción de los pasos del workflow, qué hace cada uno y qué decisión de diseño tomaron.
Por ejemplo: por qué el deploy solo corre si los tests pasan, qué pasa si falla el lint.
-->

El pipeline (`.github/workflows/ci-cd.yml`) se dispara en cada push o PR a `main` y ejecuta,
en orden: **lint → tests unitarios → tests E2E → build → deploy a Vercel**. Cada etapa depende
de que la anterior haya pasado (`needs:`), de modo que si el lint o algún test falla, el pipeline
se detiene ahí y el deploy nunca llega a ejecutarse.

(completar: justificar por qué eligieron este orden específico, qué pasa si falla cada etapa,
si el deploy es solo en push a main o también en PRs con preview deployments, etc.)

## 6. Limitaciones y deuda técnica

<!--
Qué quedó sin cubrir, qué mejorarían con más tiempo, qué sabían que era frágil y aceptaron
como riesgo consciente.
-->

(completar)

---

## Opcionales (completar si aplica)

### Error monitoring (Sentry)

(completar si lo implementaron)

### Cobertura de tests

(completar resultado de `vitest --coverage` si lo implementaron)

### Uso de IA para generación de tests

(completar: qué generó la IA, qué modificaron del resultado y por qué)
