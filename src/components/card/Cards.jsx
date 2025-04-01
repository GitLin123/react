import { 
    EditFilled, 
    RocketFilled, 
    PictureFilled,
    RobotFilled
  } from '@ant-design/icons';
  import { Card } from 'antd';
  import { useNavigate } from 'react-router-dom';
  const cardStyle = {
    margin: 'auto',
    width: '13rem',
    height: '6.5rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(70, 70, 70, 0.09)',
    position: 'relative',
    overflow: 'hidden',
  };
const cardData = [
    {
      name:'图片编辑',
      url:'/edit',
      icon: EditFilled,
      image:''
    },
    {
      name:'超分辨率',
      url:'/upscale',
      icon: RocketFilled,
      image:''
    },
    {
      name:'去除背景',
      url:'/back',
      icon: PictureFilled,
      image:''
    },
    {
      name:'AI生图',
      url:'/ai',
      icon: RobotFilled,
      image:''
    }
  ]

  const Cards = () => {
    const navigate = useNavigate()
    return (<>
        {cardData.map(item => (
    <Card
      key={item.name}
      style={cardStyle}
      onClick={() => navigate(item.url)}
      styles={{ 
        padding: '12px',
        position: 'relative',
        height: '100%'
      }}
      hoverable
    >
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        transition: 'all 0.3s ease',
        textAlign: 'center',
        width: '100%'
      }}>
        {/* 图标容器 */}
        <div style={{
          transition: 'all 0.3s ease',
          opacity: 1,
          transform: 'translateY(0)'
        }}>
          <item.icon style={{ fontSize: '1.5rem' }} />
        </div>
        
        {/* 文字容器 */}
        <h3 style={{
          margin: '8px 0 0',
          transition: 'all 0.3s ease',
          transform: 'scale(1)'
        }}>{item.name}</h3>
      </div>
    </Card>
  ))}
    </>)
  } 

  export default Cards;