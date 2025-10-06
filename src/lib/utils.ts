import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Goal, GoalStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export const getGoalStatus = (goal: Goal): GoalStatus => {
  if (goal.current >= goal.target) {
    return 'completed';
  }
  if (goal.dueDate && new Date(goal.dueDate) < new Date()) {
    return 'overdue';
  }
  return 'active';
};
