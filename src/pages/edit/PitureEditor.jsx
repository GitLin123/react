import { useRef, useEffect, useState } from 'react';
import  {fabric}  from 'fabric';

const PictureEditor = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);

  // 初始化画布
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvasInstance = new fabric.Canvas(canvasRef.current, {
      preserveObjectStacking: true,
      width: 800,
      height: 600
    });

    // 历史记录初始化
    canvasInstance.on('object:modified', () => handleHistory(canvasInstance));
    canvasInstance.on('object:added', () => handleHistory(canvasInstance));

    setCanvas(canvasInstance);

    return () => {
      canvasInstance.dispose();
    };
  }, []);

  // 历史记录管理
  const handleHistory = (canvasInstance) => {
    const json = JSON.stringify(canvasInstance);
    setHistory(prev => [...prev.slice(0, currentStep + 1), json]);
    setCurrentStep(prev => prev + 1);
  };

  // 图片上传
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !canvas) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      fabric.Image.fromURL(event.target.result, img => {
        img.scaleToWidth(400);
        canvas.add(img);
        img.bringToFront();
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  // 添加文字
  const addText = () => {
    if (!canvas) return;
    
    const text = new fabric.IText('点击编辑文字', {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: '#000'
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  // 应用滤镜
  const applyFilter = (filterType) => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject?.filters) return;

    let filter;
    switch(filterType) {
      case 'grayscale':
        filter = new fabric.Image.filters.Grayscale();
        break;
      case 'invert':
        filter = new fabric.Image.filters.Invert();
        break;
      default:
        return;
    }

    const filters = activeObject.filters;
    const hasFilter = filters.some(f => f.type === filterType);
    
    if (hasFilter) {
      activeObject.filters = filters.filter(f => f.type !== filterType);
    } else {
      filters.push(filter);
    }
    
    activeObject.applyFilters();
    canvas.renderAll();
  };

  // 撤销/重做
  const handleUndoRedo = (step) => {
    if (!canvas || !history[step]) return;
    
    canvas.loadFromJSON(JSON.parse(history[step]), () => {
      canvas.renderAll();
      setCurrentStep(step);
    });
  };

  // 导出图片
  const exportImage = () => {
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL({
      format: 'png',
      quality: 0.8
    });
    link.click();
  };

  return (
    <div className="editor-container">
      <div className="toolbar">
        <label className="upload-btn">
          上传图片
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            style={{ display: 'none' }}
          />
        </label>
        
        <button onClick={addText}>添加文字</button>
        <button onClick={() => canvas?.getActiveObject() && canvas.remove(canvas.getActiveObject())}>
          删除选中
        </button>
        
        <div className="filter-group">
          <button onClick={() => applyFilter('grayscale')}>灰度</button>
          <button onClick={() => applyFilter('invert')}>反色</button>
        </div>

        <div className="history-controls">
          <button 
            disabled={currentStep <= 0}
            onClick={() => handleUndoRedo(currentStep - 1)}
          >
            撤销
          </button>
          <button 
            disabled={currentStep >= history.length - 1}
            onClick={() => handleUndoRedo(currentStep + 1)}
          >
            重做
          </button>
        </div>

        <button onClick={exportImage}>导出图片</button>
      </div>

      <canvas ref={canvasRef} />
    </div>
  );
};

// 样式部分
const styles = `
  .editor-container {
    display: flex;
    gap: 20px;
    padding: 20px;
    background: #f0f2f5;
  }

  .toolbar {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 200px;
  }

  button, .upload-btn {
    padding: 8px 12px;
    background: white;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
  }

  button:hover, .upload-btn:hover {
    background:rgb(84, 147, 242);
    color: white;
    border-color:rgb(115, 170, 222);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  canvas {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    border-radius: 8px;
  }

  .filter-group {
    margin: 15px 0;
    padding: 10px;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }
`;

// 注入全局样式
document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);

export default PictureEditor;

