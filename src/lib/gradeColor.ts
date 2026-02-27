import type { Grade, Decision } from "@/data/types";

export function gradeColor(grade: Grade | string): string {
  switch (grade) {
    case "A":
      return "#52c41a"; // green
    case "B":
      return "#faad14"; // yellow/amber
    case "C":
      return "#ff4d4f"; // red
    case "D":
      return "#8c8c8c"; // gray
    default:
      return "#8c8c8c";
  }
}

export function gradeBg(grade: Grade | string): string {
  switch (grade) {
    case "A":
      return "#f6ffed";
    case "B":
      return "#fffbe6";
    case "C":
      return "#fff2f0";
    case "D":
      return "#f5f5f5";
    default:
      return "#f5f5f5";
  }
}

export function decisionColor(decision: Decision): string {
  switch (decision) {
    case "Y":
      return "#52c41a";
    case "CONDITIONAL_Y":
      return "#faad14";
    case "N":
      return "#ff4d4f";
  }
}

export function decisionLabel(decision: Decision): string {
  switch (decision) {
    case "Y":
      return "Y (투자 승인)";
    case "CONDITIONAL_Y":
      return "조건부 Y (보류)";
    case "N":
      return "N (거절)";
  }
}

export function decisionEmoji(decision: Decision): string {
  switch (decision) {
    case "Y":
      return "🟢";
    case "CONDITIONAL_Y":
      return "🟡";
    case "N":
      return "🔴";
  }
}
