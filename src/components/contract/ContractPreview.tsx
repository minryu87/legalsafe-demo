"use client";

import { Card } from "antd";
import { useMemo } from "react";
import { useContractStore } from "@/stores/useContractStore";
import { generateContractMarkdown } from "@/lib/contractTemplate";

/**
 * 계약서 미리보기 (우측 패널)
 * 마크다운 → HTML 변환 + A4 스타일 렌더링
 */
export default function ContractPreview() {
  const form = useContractStore((s) => s.form);

  const html = useMemo(() => {
    const md = generateContractMarkdown(form);
    return md
      // headings
      .replace(/^### (.*$)/gm, '<h3 style="margin:16px 0 6px;font-size:14px;font-weight:700">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 style="margin:20px 0 8px;font-size:15px;font-weight:700">$1</h2>')
      .replace(/^# \[(.+?)\](.*$)/gm, '<h1 style="margin:32px 0 12px;font-size:17px;font-weight:700;border-top:2px solid #333;padding-top:16px">[$1]$2</h1>')
      .replace(/^# (.*$)/gm, '<h1 style="margin:0 0 16px;font-size:18px;font-weight:700;text-align:center">$1</h1>')
      // bold
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // horizontal rules
      .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #d9d9d9;margin:16px 0"/>')
      // tables
      .replace(/^\|(.+)\|$/gm, (_match, content: string) => {
        const cells = content.split("|").map((c: string) => c.trim());
        const isHeader = cells.every((c: string) => /^-+$/.test(c));
        if (isHeader) return "<!-- table-sep -->";
        const tag = "td";
        const row = cells
          .map((c: string) => `<${tag} style="border:1px solid #e8e8e8;padding:6px 10px;font-size:12px">${c}</${tag}>`)
          .join("");
        return `<tr>${row}</tr>`;
      })
      // wrap table rows
      .replace(/((?:<tr>.*<\/tr>\n?)+)/g, '<table style="width:100%;border-collapse:collapse;margin:8px 0">$1</table>')
      // remove table separator comments
      .replace(/<!-- table-sep -->\n?/g, "")
      // numbered lists
      .replace(/^(\d+)\. (.*$)/gm, '<div style="margin:4px 0 4px 16px;font-size:13px"><strong>$1.</strong> $2</div>')
      // checkbox
      .replace(/□ (.*$)/gm, '<div style="margin:8px 0;font-size:13px">☐ $1</div>')
      // newlines
      .replace(/\n\n/g, '<div style="margin:8px 0"></div>')
      .replace(/\n/g, "<br/>");
  }, [form]);

  return (
    <Card
      title="계약서 미리보기"
      size="small"
      styles={{
        body: {
          maxHeight: "calc(100vh - 180px)",
          overflow: "auto",
          padding: "32px 40px",
        },
      }}
    >
      <div
        style={{
          fontFamily: "'Noto Sans KR', 'Malgun Gothic', sans-serif",
          fontSize: 13,
          lineHeight: 1.7,
          color: "var(--text-primary)",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Card>
  );
}
