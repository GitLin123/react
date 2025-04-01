import React, { useState } from "react";
import { Upload, Image, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { removeBackground } from '@imgly/background-removal'
import ReactCompareImage from 'react-compare-image';
const { Dragger } = Upload;

const BackRemove = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [imageUrl2, setImageUrl2] = useState(null);

  // 上传前验证
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("只能上传图片文件！");
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("图片大小不能超过5MB！");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  // 处理自定义上传（这里只做本地预览，实际需要替换为你的上传接口）
  const customRequest = ({ file, onSuccess }) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageUrl(reader.result);
      onSuccess("ok");
    };
    reader.onerror = (error) => {
      message.error("图片读取失败");
      console.error("Error reading file:", error);
    };
  };
  //处理图片背景去除的逻辑
  const handle = async () => {
    
    let res = await removeBackground(imageUrl);
    let reader = new FileReader();
    reader.readAsDataURL(res);
    reader.onload = function(e) {
        setImageUrl2(e.target.result)
    }
  }

  return (
    <div className="background-remove" style={{ padding: 24 }}>  
    <ReactCompareImage 
    leftImage="/src/assets/brfore.png" 
    leftImageCss={{width:'20rem',height:'10rem'}}
    rightImage="/src/assets/brfore.png"
    rightImageCss={{width:'20rem',height:'10rem'}}
    />;
      <h2>背景去除</h2>
      
      {/* 上传区域 */}
      <Dragger
        name="image"
        multiple={false}
        maxCount={1}
        beforeUpload={beforeUpload}
        customRequest={customRequest}
        showUploadList={false}
        accept="image/*"
        style={{ 
          width: 400,
          margin: '20px 0',
          border: '1px dashed #d9d9d9',
          borderRadius: 8
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ fontSize: 32, color: '#1890ff' }} />
        </p>
        <p className="ant-upload-text">点击或拖拽图片到此区域上传</p>
        <p className="ant-upload-hint">
          支持常见图片格式，单张图片不超过5MB
        </p>
      </Dragger>

      <div style={{display:'flex', justifyContent:'space-between'}}>
        {/* 预览区域 */}
      {imageUrl && (
        <div style={{ marginTop: 20 }}>
          <h4>预览图：</h4>
          <Image
            width={200}
            src={imageUrl}
            style={{
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            preview={{
              maskClassName: 'custom-preview-mask',
            }}
          />
        </div>
      )}
    {imageUrl && <div>
        <button onClick={handle}>转换</button>
    </div>}
      {(
        <div style={{ marginTop: 20 }}>
          <h4>结果图：</h4>
          <Image
            width={200}
            src={imageUrl2}
            style={{
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            preview={{
              maskClassName: 'custom-preview-mask',
            }}
          />
        </div>
      )}
      </div>
    </div>
  );
};

export default BackRemove;