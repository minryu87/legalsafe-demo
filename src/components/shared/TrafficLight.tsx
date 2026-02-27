"use client";

import type { Grade } from "@/data/types";
import { gradeColor } from "@/lib/gradeColor";

interface TrafficLightProps {
  grade: Grade | string;
  size?: number;
}

export default function TrafficLight({ grade, size = 12 }: TrafficLightProps) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: gradeColor(grade),
        marginRight: 6,
      }}
    />
  );
}
