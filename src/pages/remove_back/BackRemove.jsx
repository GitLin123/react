import React, { useState, useCallback } from "react";
import { Upload, Image, message, Button, Progress, List } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { removeBackground } from "@imgly/background-removal";
import Compressor from "compressorjs";

const { Dragger } = Upload;

const BackRemove = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [resultImageUrl, setResultImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({
    percent: 0,
    visible: false,
    phase: "等待开始",
    completed: false,
  });
  const [phases, setPhases] = useState([
    { key: "initializing", label: "初始化引擎", status: "pending" },
    { key: "downloading:model", label: "下载模型中", status: "pending" },
    { key: "computing:mask", label: "计算图像遮罩", status: "pending" },
    { key: "creating:final-image", label: "生成最终图像", status: "pending" },
  ]);

  const updatePhaseStatus = (currentPhase) => {
    setPhases((prevPhases) =>
      prevPhases.map((phase) => ({
        ...phase,
        status:
          phase.key === currentPhase
            ? "active"
            : phase.key === "creating:final-image" && currentPhase === "completed"
            ? "completed"
            : "pending",
      }))
    );
  };

  const handleProgress = useCallback((phase, loaded, total) => {
    const phaseMap = {
      "initializing": { start: 0, end: 10, label: "初始化引擎" },
      "downloading:model": { start: 10, end: 30, label: "下载模型中..." },
      "computing:mask": { start: 30, end: 70, label: "计算图像遮罩" },
      "creating:final-image": { start: 70, end: 100, label: "生成最终图像" },
      
    };

    const currentPhase = phaseMap[phase] || { start: 0, end: 100, label: "处理中..." };
    const { start, end, label } = currentPhase;

    // 更新阶段状态
    updatePhaseStatus(phase);

    // 根据当前阶段计算进度
    const phaseProgress = loaded && total ? (loaded / total) * (end - start) : 0;
    const calculatedPercent = Math.min(start + phaseProgress, end);

    setProgress((prev) => ({
      ...prev,
      percent: Math.round(calculatedPercent),
      phase: label,
      visible: true,
    }));
  }, []);

  const handleProcess = async () => {
    if (!imageFile) return;

    try {
      setLoading(true);
      setProgress({ percent: 0, visible: true, phase: "开始处理", completed: false });
      setPhases((prevPhases) =>
        prevPhases.map((phase) => ({ ...phase, status: "pending" }))
      );

      const res = await removeBackground(imageFile, {
        progress: handleProgress,
        device: "gpu",
        model: "isnet_quint8",
        proxyToWorker: true,
        output: { quality: 0.8 },
      });

      const resultUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(res);
      });

      setResultImageUrl(resultUrl);
      setProgress((p) => ({ ...p, percent: 100, phase: "处理完成!", completed: true }));
      updatePhaseStatus("completed");
    } catch (error) {
      message.error(`处理失败: ${error.message}`);
      setProgress((p) => ({ ...p, phase: "处理失败!", visible: true, completed: false }));
    } finally {
      setLoading(false);
      setTimeout(() => {
        setProgress((p) => ({ ...p, visible: false }));
      }, 3000);
    }
  };

  const customRequest = ({ file }) => {
    new Compressor(file, {
      maxWidth: 3000,
      maxHeight: 3000,
      success: (compressedFile) => {
        if (imageUrl) URL.revokeObjectURL(imageUrl);
        setImageFile(compressedFile);
        setImageUrl(URL.createObjectURL(compressedFile));
      },
      error: (err) => {
        message.error("图片压缩失败");
        console.error("Compression error:", err);
      },
    });
  };

  const handleDownload = () => {
    if (!resultImageUrl) return;

    const link = document.createElement("a");
    link.href = resultImageUrl;
    link.download = `processed-image-${Date.now()}.png`;
    link.click();
    if (resultImageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(resultImageUrl);
    }
  };

  const resetState = () => {
    setImageFile(null);
    setImageUrl(null);
    setResultImageUrl(null);
    setProgress({ percent: 0, visible: false, phase: "等待开始", completed: false });
    setPhases((prevPhases) =>
      prevPhases.map((phase) => ({ ...phase, status: "pending" }))
    );
  };

  return (
    <div className="background-remove" style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      {!imageFile && (
        <Dragger
          name="image"
          multiple={false}
          maxCount={1}
          beforeUpload={(file) => {
            const isValid = file.type.startsWith("image/");
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isValid) message.error("只能上传图片文件！");
            if (!isLt5M) message.error("图片大小不能超过5MB！");
            return isValid && isLt5M;
          }}
          customRequest={customRequest}
          showUploadList={false}
          accept="image/*"
          style={{
            padding: 20,
            border: "1px dashed #d9d9d9",
            borderRadius: 8,
            textAlign: "center",
            backgroundColor: "#fafafa",
          }}
        >
          <InboxOutlined style={{ fontSize: 48, color: "#1890ff" }} />
          <p style={{ marginTop: 16, fontSize: 16 }}>点击或拖拽图片到此区域上传</p>
          <p style={{ color: "#999" }}>支持常见图片格式，单张图片不超过5MB</p>
        </Dragger>
      )}

      {imageFile && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div style={{ flex: 1, textAlign: "center" }}>
              <h4>原始图片</h4>
              <Image
                width={200}
                src={imageUrl}
                style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
              />
            </div>
            {resultImageUrl && (
              <div style={{ flex: 1, textAlign: "center" }}>
                <h4>处理结果</h4>
                <Image
                  width={200}
                  src={resultImageUrl}
                  style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                />
              </div>
            )}
          </div>

          <div style={{ marginTop: 20 }}>
            <List
              size="small"
              bordered
              dataSource={phases}
              renderItem={(item) => (
                <List.Item style={{ color: item.status === "active" ? "#1890ff" : item.status === "completed" ? "#52c41a" : "#999" }}>
                  {item.label}
                </List.Item>
              )}
            />
          </div>

          <div style={{ marginTop: 20, textAlign: "center" }}>
            {!resultImageUrl && (
              <Button type="primary" onClick={handleProcess} loading={loading}>
                {loading ? "处理中..." : "开始去除背景"}
              </Button>
            )}
            {progress.visible && (
              <div style={{ marginTop: 20 }}>
                <Progress
                  percent={progress.percent}
                  status={progress.completed ? "success" : "active"}
                  strokeColor={progress.completed ? "#52c41a" : "#1890ff"}
                  format={() => progress.phase}
                />
              </div>
            )}
          </div>

          {resultImageUrl && (
            <div style={{ marginTop: 20, textAlign: "center" }}>
              <Button type="primary" onClick={handleDownload} style={{ marginRight: 10 }}>
                下载结果图
              </Button>
              <Button onClick={resetState}>重新上传</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BackRemove;