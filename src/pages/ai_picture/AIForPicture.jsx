// src/components/ImageGenerator.jsx
import React, { useEffect, useState } from 'react';
import { generate } from '../../api/aigc.api';
import { Input, Image, message, Layout, Menu, Button } from 'antd';
import { uploadFile } from '../../api/upload.api';
import { useStore } from 'react-redux';
import { RobotOutlined } from '@ant-design/icons';
import { getUserImage } from '../../api/user.api';
const { Sider, Content } = Layout;
const { TextArea } = Input;

const ImageGenerator = () => {
  const store = useStore().getState();
  const id = store.user.data.id;
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imgArr, setImgArr] = useState([]); // 使用 useState 管理 imgArr
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('模型1'); // 当前选择的模型

  // 处理提交
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSubmit();
      }
    };
    const fetchUserImages = async () => {
          try {
            const response = await getUserImage(id);
            setImgArr(response.images);
          } catch (error) {
            console.error("获取用户图库失败:", error);
          }
        };
        fetchUserImages();

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await generate({ prompt, model: selectedModel });
      const newImageUrl = response?.output?.results[0]?.url;
      setImageUrl(newImageUrl);
      setImgArr((prev) => [...prev, newImageUrl]);
      await uploadFile({ id: id, file: newImageUrl });

      // 显示成功消息
      message.success('图片生成成功！');
      console.log('生成的图片URL:', newImageUrl);
    } finally {
      setLoading(false);
    }
  };

  const handleModelChange = (key) => {
    setSelectedModel(key);
    message.info(`已切换到 ${key}`);
  };

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      {/* 左侧垂直导航栏 */}
      <Sider
        theme="light"
        width={200}
        style={{
          borderRight: '1px solid #ddd',
          overflow: 'auto', // 独立滚动
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: "3.5rem",
          bottom: 0,
        }}
      >
        <Menu
          mode="inline"
          title='AI模型'
          defaultSelectedKeys={['通义万象2.1']}
          style={{ height: '100%',width: 'auto' }}
          onClick={(e) => handleModelChange(e.key)}
        >
          <Menu.Item key="通义万象2.1" icon={<RobotOutlined />}>
            通义万象2.1
          </Menu.Item>
          <Menu.Item key="MidJourney" icon={<RobotOutlined />}>
            MidJourney
          </Menu.Item>
          <Menu.Item key="SD" icon={<RobotOutlined />}>
            Stable Diffusion
          </Menu.Item>
          <Menu.Item key="GPT4o" icon={<RobotOutlined />}>
            GPT-4o
          </Menu.Item>
        </Menu>
      </Sider>

      {/* 右侧内容区域 */}
      <Layout style={{ marginLeft: 200, height: '100vh', overflow: 'hidden' }}>
        <Content
          style={{
            padding: '1rem',
            background: '#fff',
            overflow: 'auto', // 独立滚动
            height: '100%',
          }}
        >
          <div style={{ marginBottom: '3rem' }}>
            <h2>AI 生图</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <TextArea
                type="text"
                rows={1}
                placeholder="请输入提示词 (maxLength: 100)"
                maxLength={100}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                style={{ flex: 1 }}
              />
              <Button type="primary" onClick={handleSubmit} loading={loading}>
                {loading ? '生成中...' : '生成图片'}
              </Button>
            </div>
            {imageUrl && (
              <div style={{ marginTop: '2rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <Image src={imageUrl} alt="生成的图片" width={200} height={200} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Button
                    type="primary"
                    size='small'
                    onClick={() => {
                      message.info('跳转到编辑页面');
                      // 在这里添加跳转到编辑页面的逻辑
                    }}
                  >
                    编辑
                  </Button>
                  <Button
                    size='small'
                    type="default"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = imageUrl;
                      link.download = '生成图片.png';
                      link.click();
                      message.success('图片下载成功！');
                    }}
                  >
                    下载
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div>
            <h2>最近生成的图片</h2>
            <div className="photo-wall" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {imgArr?.slice(imgArr.length - 4, imgArr.length)?.map((url, index) => (
                <div
                  key={index}
                  className="photo-card"
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '10px',
                    textAlign: 'center',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Image src={url} alt={`生成结果 ${index + 1}`} width={200} height={150} />
                  <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                    <Button
                      type="primary"
                      size='small'
                      onClick={() => {
                        message.info(`编辑图片 ${index + 1}`);
                        // 在这里添加跳转到编辑页面的逻辑
                      }}
                    >
                      编辑
                    </Button>
                    <Button
                      type="default"
                      size='small'
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `生成图片_${index + 1}.png`;
                        link.click();
                        message.success(`图片 ${index + 1} 下载成功！`);
                      }}
                    >
                      下载
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ImageGenerator;