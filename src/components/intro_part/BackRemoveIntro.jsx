/** 
 * 背景介绍部分的组件
 * 
*/

import ReactCompareImage from 'react-compare-image';
import { useNavigate } from "react-router-dom";
import ActiveButton from '../../components/button/ActiveButton';

const BackRemoveIntro = () => {
    const navigate = useNavigate();
    return (
        <div style={{display:'flex',
            justifyContent:'space-around',
            marginTop: '10rem'
            }}>
            
            <h1>
                一键去除图片背景 <br/>快速准确符合需求✨<br /><br />
                使用JS开源背景去除库<br />
                轻量化 + 高效化✨
                <br /><br /><br />
                <ActiveButton onClick={()=>navigate('/back')}>尝试一下</ActiveButton>
            </h1>

            <div  style={{
                width:'35rem',
                height:'20.5rem',
                display:'flex',
                boxShadow: '0 2px 8px rgba(56, 56, 56, 0.35)',
                padding:'0.8rem',
                justifyContent:'space-between'
                }}>
                <ReactCompareImage
                rightImage='/src/assets/rebg_before.jpg'
                leftImage='/src/assets/rebg_after.png'
                />  
            </div>
        </div>)
}

export default BackRemoveIntro;
