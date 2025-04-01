/**
 * 首页的第一个关于超分辨率介绍的组件
 * */ 

import ReactCompareImage from 'react-compare-image';
import { useNavigate } from "react-router-dom";
import ActiveButton from '../../components/button/ActiveButton';

const UpscaleIntro = () =>{

      const navigate = useNavigate();
    return (
        <div style={{display:'flex',
            justifyContent:'space-around',
            marginTop: '10rem'
            }}>
        {/* 左图片对比器 右文字说明 + 按钮 */}
            <div  style={{
                width:'20rem',
                height:'29.5rem',
                display:'flex',
                boxShadow: '0 2px 8px rgba(36, 36, 36, 0.35)',
                padding:'0.8rem',
                justifyContent:'space-between'
                }}>
                <ReactCompareImage
                rightImage='/src/assets/BeforeUpscale.jpg'
                leftImage='/src/assets/AfterUpscale.png'
                vertical="true"
                />  
            </div>
            <h1>
                AI技术助力生产力 <br/>智能提升你的图片品质✨<br /><br />
                Onnx Runtime +  WebAssmbely <br />
                高性能组合之选✨
                <br /><br /><br />
                <ActiveButton onClick={()=>navigate('/upscale')}>尝试一下</ActiveButton>
            </h1>
        </div>)
}

export default UpscaleIntro;

