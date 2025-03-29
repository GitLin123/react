import { useEffect, useState, useRef } from 'react';

export default function SuperResolution() {
  const [session, setSession] = useState(null);
  const [outputImage, setOutputImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  // 初始化模型
  useEffect(() => {
    const initModel = async () => {
      try {
        setLoading(true);
        setError("");
        
        // 1. 动态加载ONNX Runtime CDN
        if (!window.ort) {
          await loadScript('https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js');
        }

        // 2. 配置WASM路径（使用CDN托管的WASM文件）
        window.ort.env.wasm.wasmPaths = {
          'ort-wasm.wasm': 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort-wasm.wasm',
          'ort-wasm-simd.wasm': 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort-wasm-simd.wasm'
        };

        // 3. 加载模型（模型文件需放在public目录）
        const session = await window.ort.InferenceSession.create(
          '/models/realesr.onnx',
          { executionProviders: ['wasm'] }
        );
        setSession(session);
      } catch (err) {
        console.error("模型加载失败:", err);
        setError(`模型加载失败: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    // 动态加载JS脚本
    const loadScript = (url) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`脚本加载失败: ${url}`));
        document.head.appendChild(script);
      });
    };

    initModel();
  }, []);

  // 处理文件上传
  const handleImageUpload = async (e) => {
    if (!session || !e.target.files?.[0]) return;

    try {
      setLoading(true);
      setError("");
      
      // 1. 加载图片
      const image = await loadImage(e.target.files[0]);
      
      // 2. 预处理
      const inputTensor = await preprocessImage(image);
      
      // 3. 推理
      const outputs = await session.run({ [session.inputNames[0]]: inputTensor });
      
      // 4. 后处理
      const outputUrl = await postprocessOutput(outputs[session.outputNames[0]]);
      setOutputImage(outputUrl);
    } catch (err) {
      console.error("处理失败:", err);
      setError(`处理失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 辅助函数 - 加载图片
  const loadImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // 辅助函数 - 预处理
  const preprocessImage = (image) => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const inputData = new Float32Array(3 * image.width * image.height);

    // 转换为 NCHW 格式 [1,3,H,W]
    for (let i = 0; i < imageData.data.length / 4; i++) {
      inputData[i] = imageData.data[i * 4] / 255.0;     // R
      inputData[i + image.width * image.height] = imageData.data[i * 4 + 1] / 255.0; // G
      inputData[i + 2 * image.width * image.height] = imageData.data[i * 4 + 2] / 255.0; // B
    }

    return new window.ort.Tensor("float32", inputData, [1, 3, image.height, image.width]);
  };

  // 辅助函数 - 后处理
  const postprocessOutput = async (tensor) => {
    const [_, C, H, W] = tensor.dims;
    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(W, H);

    // 转换为 RGBA
    const data = tensor.data;
    for (let i = 0; i < H * W; i++) {
      imageData.data[i * 4] = Math.min(255, Math.max(0, data[i] * 255));           // R
      imageData.data[i * 4 + 1] = Math.min(255, Math.max(0, data[i + H * W] * 255)); // G
      imageData.data[i * 4 + 2] = Math.min(255, Math.max(0, data[i + 2 * H * W] * 255)); // B
      imageData.data[i * 4 + 3] = 255;                                             // Alpha
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  };

  return (
    <div className="container">
      <h1>图像超分辨率</h1>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={!session || loading}
      />
      
      {loading && <p>处理中...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <div style={{ marginTop: 20 }}>
        {outputImage && (
          <img 
            src={outputImage} 
            alt="超分辨率结果"
            style={{ maxWidth: "100%" }}
          />
        )}
      </div>
      
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}