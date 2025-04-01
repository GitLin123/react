import { useEffect, useState, useRef } from 'react';
import * as ort from 'onnxruntime-web';

export default function SuperResolution() {
  const [session, setSession] = useState(null);
  const [outputImage, setOutputImage] = useState("");
  const [inputImage, setInputImage] = useState("");
  const [loading, setLoading] = useState({ model: false, inference: false });
  const [error, setError] = useState("");
  const canvasRef = useRef(null);
  // WASM支持检测
  const checkWasmSupport = () => {
    try {
      return typeof WebAssembly === 'object' && 
             WebAssembly.validate(new Uint8Array([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]));
    } catch (e) {
      return false;
    }
  };

  // 初始化模型
  useEffect(() => {
    const initModel = async () => {
      try {
        if (!checkWasmSupport()) {
          throw new Error("浏览器不支持WebAssembly，请使用Chrome/Firefox/Edge等现代浏览器");
        }

        setLoading(prev => ({ ...prev, model: true }));
        setError("");

        ort.env.wasm.wasmPaths = {
          'ort-wasm.wasm': 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.15.1/dist/ort-wasm.wasm',
          'ort-wasm-simd.wasm': 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.15.1/dist/ort-wasm-simd.wasm'
        };

        const session = await ort.InferenceSession.create(
          '/models/realesr.onnx',
          { 
            executionProviders: ['wasm'],
            graphOptimizationLevel: 'all'
          }
        );
        
        setSession(session);
      } catch (err) {
        console.error("模型加载失败:", err);
        setError(err.message);
      } finally {
        setLoading(prev => ({ ...prev, model: false }));
      }
    };

    initModel();

    return () => {
      if (session) {
        session.release();
      }
    };
  }, []);

  // 处理文件上传
  const handleImageUpload = async (e) => {
    if (!session || !e.target.files?.[0]) return;

    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      setError("仅支持JPEG/PNG格式图片");
      return;
    }

    try {
      setLoading(prev => ({ ...prev, inference: true }));
      setError("");

      // 加载并显示原始图片
      const image = await loadImage(file);
      if (image.width > 4096 || image.height > 4096) {
        throw new Error("图片尺寸过大（最大支持4096x4096）");
      }
      setInputImage(URL.createObjectURL(file));

      // 预处理
      const { tensor, canvas } = preprocessImage(image);
      
      // 推理
      const outputs = await session.run({ [session.inputNames[0]]: tensor });
      const outputTensor = outputs[session.outputNames[0]];
      
      // 后处理
      const outputUrl = postprocessOutput(outputTensor);
      setOutputImage(outputUrl);

      // 清理资源
      tensor.dispose();
      outputTensor.dispose();
      canvas.remove();
    } catch (err) {
      console.error("处理失败:", err);
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, inference: false }));
    }
  };

  // 图片加载
  const loadImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("图片加载失败"));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error("文件读取失败"));
      reader.readAsDataURL(file);
    });
  };

  // 图像预处理
  const preprocessImage = (image) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    // 保持宽高比调整尺寸
    const maxSize = 1024;
    let width = image.width;
    let height = image.height;
    
    if (width > maxSize || height > maxSize) {
      const ratio = Math.min(maxSize / width, maxSize / height);
      width = Math.floor(width * ratio);
      height = Math.floor(height * ratio);
    }
    
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const inputData = new Float32Array(3 * width * height);

    // 标准化处理 (假设模型需要[0,1]范围输入)
    for (let i = 0; i < imageData.data.length / 4; i++) {
      inputData[i] = imageData.data[i * 4] / 255.0;     // R
      inputData[i + width * height] = imageData.data[i * 4 + 1] / 255.0; // G
      inputData[i + 2 * width * height] = imageData.data[i * 4 + 2] / 255.0; // B
    }

    return {
      tensor: new ort.Tensor("float32", inputData, [1, 3, height, width]),
      canvas
    };
  };

  // 结果后处理
  const postprocessOutput = (tensor) => {
    const [_, C, H, W] = tensor.dims;
    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(W, H);

    const data = tensor.data;
    for (let i = 0; i < H * W; i++) {
      imageData.data[i * 4] = Math.min(255, Math.max(0, data[i] * 255));           // R
      imageData.data[i * 4 + 1] = Math.min(255, Math.max(0, data[i + H * W] * 255)); // G
      imageData.data[i * 4 + 2] = Math.min(255, Math.max(0, data[i + 2 * H * W] * 255)); // B
      imageData.data[i * 4 + 3] = 255; // Alpha
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  };

  return (
    <div className="container">
      <h1>图像超分辨率处理</h1>
      
      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={!session || loading.model || loading.inference}
        />
        <p className="hint">支持格式：JPEG/PNG（最大4096x4096）</p>
      </div>

      {loading.model && <div className="loading">模型加载中（首次使用需下载约10MB文件）...</div>}
      {loading.inference && <div className="loading">图片处理中，请稍候...</div>}
      {error && <div className="error">{error}</div>}

      <div className="comparison-container">
        {inputImage && (
          <div className="image-card">
            <h3>原始图片</h3>
            <img 
              src={inputImage} 
              alt="原始图片"
              style={{ maxWidth: "100%", maxHeight: "70vh" }}
            />
          </div>
        )}
        
        {outputImage && (
          <div className="image-card">
            <h3>高清修复结果</h3>
            <img 
              src={outputImage} 
              alt="超分辨率结果"
              style={{ maxWidth: "100%", maxHeight: "70vh" }}
            />
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}