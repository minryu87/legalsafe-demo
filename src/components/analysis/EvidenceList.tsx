"use client";

import { Table, Tag, Card, Upload, Button, Empty, message } from "antd";
import { UploadOutlined, FileTextOutlined } from "@ant-design/icons";
import type { EvidenceResponse } from "@/data/api-types";
import type { UploadFile } from "antd";
import { useState } from "react";
import { uploadEvidence } from "@/lib/api/evidence";

interface Props {
  evidences: EvidenceResponse[];
  caseId: string;
  onUploaded?: () => void;
}

export default function EvidenceList({ evidences, caseId, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleUpload = async () => {
    const files = fileList
      .map((f) => f.originFileObj)
      .filter((f): f is NonNullable<typeof f> => !!f) as File[];
    if (files.length === 0) return;

    setUploading(true);
    try {
      const res = await uploadEvidence(caseId, files);
      message.success(`${res.uploaded.length}개 파일 업로드 완료`);
      setFileList([]);
      onUploaded?.();
    } catch (err) {
      message.error("업로드 실패: " + String(err));
    } finally {
      setUploading(false);
    }
  };

  const columns = [
    {
      title: "",
      key: "icon",
      width: 40,
      render: () => <FileTextOutlined style={{ color: "#1677ff" }} />,
    },
    {
      title: "파일명",
      dataIndex: "file_name",
      key: "name",
    },
    {
      title: "유형",
      dataIndex: "file_type",
      key: "type",
      width: 100,
      render: (t: string | null) => <Tag>{t ?? "unknown"}</Tag>,
    },
    {
      title: "추출 텍스트",
      dataIndex: "extracted_text",
      key: "text",
      ellipsis: true,
      render: (t: string | null) => (
        <span style={{ fontSize: 12, color: "#595959" }}>
          {t ? t.slice(0, 100) + (t.length > 100 ? "..." : "") : "-"}
        </span>
      ),
    },
    {
      title: "등록일",
      dataIndex: "created_at",
      key: "created",
      width: 140,
      render: (d: string) => new Date(d).toLocaleDateString("ko-KR"),
    },
  ];

  return (
    <div>
      <Card size="small" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Upload
            multiple
            fileList={fileList}
            onChange={({ fileList: fl }) => setFileList(fl)}
            beforeUpload={() => false}
            showUploadList={true}
          >
            <Button icon={<UploadOutlined />}>파일 선택</Button>
          </Upload>
          {fileList.length > 0 && (
            <Button
              type="primary"
              onClick={handleUpload}
              loading={uploading}
            >
              {fileList.length}개 파일 업로드
            </Button>
          )}
        </div>
      </Card>

      {evidences.length === 0 ? (
        <Empty description="업로드된 증거가 없습니다" />
      ) : (
        <Table
          dataSource={evidences}
          columns={columns}
          rowKey="evidence_id"
          pagination={false}
          size="small"
        />
      )}
    </div>
  );
}
