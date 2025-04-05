import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TextPlugin } from "gsap/TextPlugin";
import Cards from '../../components/card/Cards';
import UpscaleIntro from '../../components/intro_part/UpscaleIntro';
import BackRemoveIntro from '../../components/intro_part/BackRemoveIntro';
const Home = () => {
  // 注册文本插件
gsap.registerPlugin(TextPlugin);
  // 创建两个ref用于DOM元素引用
  const leftTextRef = useRef(null);
  const rightTextRef = useRef(null);
  useEffect(() => {
    // 确保元素已经加载
    if (leftTextRef.current && rightTextRef.current) {
      // 创建时间线动画
      gsap.from([leftTextRef.current, rightTextRef.current], {
        duration: 1.5,
        x: (index) => (index === 0 ? -100 : 100), // 左边元素从-100px开始，右边从100px开始
        opacity: 0,
        ease: "power4.out",
        stagger: 0.2, // 两个元素动画间隔0.2秒
        onComplete: () => {
          // 动画完成后添加弹性效果
          gsap.to([leftTextRef.current, rightTextRef.current], {
            duration: 0.5,
            x: 0,
            ease: "elastic.out(1, 0.3)"
          });
        }
      });
    }
  }, []); // 空依赖数组表示只在组件挂载时运行一次

  const feedTextRef = useRef(null);
  const originalText = "Feed Your Satisfaction❤️";

  useEffect(() => {
    const element = feedTextRef.current;
    let tl = gsap.timeline({ repeat: -1 });

    // 打字动画序列
    tl.to(element, {
      duration: 3, // 持续时间
      text: {
        value: originalText,
        speed: 0.8, // 打字速度（字符/秒）
      },
      ease: "none"
    })
    .to({}, { duration: 2 }) // 停留时间
    .to(element, {
      duration: 1.5, // 回删时间
      text: {
        value: "",
        speed: 1.5, // 删除速度
      },
      ease: "none"
    })
    .to({}, { duration: 0.5 }); // 删除后间隔

    return () => tl.kill();
  }, []);

  return (
    <>
    <div style={{ 
      display: "flex",
      justifyContent: 'center',
      alignItems: "center",
      overflow: "hidden" // 防止动画过程中出现滚动条
    }}>
      <div>
        <h1 style={{ display: "flex", flexDirection: "row" }}>
          <span ref={leftTextRef} style={{ display: 'inline-block' }}><h1>在线图片</h1></span>
          <span ref={rightTextRef} style={{ display: 'inline-block' }}><h1>工具箱</h1></span>
        </h1>
      </div>
    </div>
    <div style={{ 
      display: "flex",
      justifyContent: 'center',
      alignItems: "center",
      overflow: "hidden",
      padding:'18px'
    }}>

    {/* 四个卡片选项 */}
    <Cards></Cards>
    </div>

    {/* 底部 'Feed Your Satisfaction' */}
    <h2 ref={feedTextRef} style={{textAlign: 'center',marginTop: '80px',minHeight: '1.2em'}}></h2>

    {/* 超分辨率的展示和介绍 */}
    <UpscaleIntro></UpscaleIntro>

    {/* 背景去除的展示和介绍 */}

    <BackRemoveIntro></BackRemoveIntro>
    </>
  );
};

export default Home;