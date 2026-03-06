"use client";

import { Card, Progress, Empty, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import type { ReportResponse } from "@/data/api-types";
import { getReportDownloadUrl } from "@/lib/api/report";

interface Props {
  report: ReportResponse | null;
  loading?: boolean;
}

export default function ReportMarkdown({ report, loading }: Props) {
  if (loading) {
    return <Card loading />;
  }

  if (!report) {
    return (
      <Card>
        <Empty description="보고서가 아직 생성되지 않았습니다" />
      </Card>
    );
  }

  return (
    <div>
      {/* 승소확률 게이지 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Progress
            type="dashboard"
            percent={report.win_probability}
            format={(p) => (
              <div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{p}%</div>
                <div style={{ fontSize: 11, color: "#999" }}>승소확률</div>
              </div>
            )}
            strokeColor={
              report.win_probability >= 70
                ? "#52c41a"
                : report.win_probability >= 40
                  ? "#faad14"
                  : "#ff4d4f"
            }
            size={100}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
              심사보고서
            </div>
            <div style={{ fontSize: 12, color: "#999" }}>
              생성일: {new Date(report.created_at).toLocaleDateString("ko-KR")}
            </div>
          </div>
          <Button
            icon={<DownloadOutlined />}
            href={getReportDownloadUrl(report.case_id)}
            target="_blank"
          >
            PDF 다운로드
          </Button>
        </div>
      </Card>

      {/* 마크다운 내용 */}
      <Card size="small">
        <div
          style={{
            fontSize: 13,
            lineHeight: 1.8,
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
          }}
          dangerouslySetInnerHTML={{
            __html: report.report_content
              .replace(/^### (.*$)/gm, '<h3 style="margin-top:24px;margin-bottom:8px;font-weight:700">$1</h3>')
              .replace(/^## (.*$)/gm, '<h2 style="margin-top:32px;margin-bottom:12px;font-weight:700">$1</h2>')
              .replace(/^# (.*$)/gm, '<h1 style="margin-top:40px;margin-bottom:16px;font-weight:700">$1</h1>')
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/\n/g, "<br/>"),
          }}
        />
      </Card>
    </div>
  );
}
