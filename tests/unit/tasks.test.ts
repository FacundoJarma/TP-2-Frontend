// tests/unit/tasks.test.ts
//
// EJEMPLO de tests unitarios con Vitest.
// Reemplazar los imports y la lógica por las funciones reales del proyecto
// (por ejemplo, las que estén en src/lib).
//
// Para correrlos: npm run test

import { describe, it, expect } from "vitest";

// --- Ejemplo de función de negocio a testear ---
// Supongamos que en src/lib/tasks.ts existe algo así:
//
// export function isTaskOverdue(dueDate: string, now: Date = new Date()): boolean {
//   return new Date(dueDate) < now;
// }
//
// export function getTaskCompletionPercentage(tasks: { done: boolean }[]): number {
//   if (tasks.length === 0) return 0;
//   const completed = tasks.filter((t) => t.done).length;
//   return Math.round((completed / tasks.length) * 100);
// }

import { isTaskOverdue, getTaskCompletionPercentage } from "@/lib/tasks";

describe("isTaskOverdue", () => {
  it("devuelve true si la fecha límite ya pasó", () => {
    const fechaPasada = "2020-01-01";
    const ahora = new Date("2026-01-01");
    expect(isTaskOverdue(fechaPasada, ahora)).toBe(true);
  });

  it("devuelve false si la fecha límite todavía no llegó", () => {
    const fechaFutura = "2030-01-01";
    const ahora = new Date("2026-01-01");
    expect(isTaskOverdue(fechaFutura, ahora)).toBe(false);
  });
});

describe("getTaskCompletionPercentage", () => {
  it("devuelve 0 cuando no hay tareas", () => {
    expect(getTaskCompletionPercentage([])).toBe(0);
  });

  it("calcula correctamente el porcentaje de tareas completadas", () => {
    const tareas = [
      { done: true },
      { done: true },
      { done: false },
      { done: false },
    ];
    expect(getTaskCompletionPercentage(tareas)).toBe(50);
  });

  it("redondea el porcentaje cuando no es un número entero exacto", () => {
    const tareas = [{ done: true }, { done: false }, { done: false }];
    // 1/3 = 33.33... -> redondeado a 33
    expect(getTaskCompletionPercentage(tareas)).toBe(33);
  });
});
