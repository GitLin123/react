import {fabric} from 'fabric';
import { useRef } from 'react';

const EditDemo = () => {
    const canvasRef = useRef(null);
    const canvas = new fabric.Canvas(canvasRef.current,{
        width: 800,
      height: 600,
    });

    const rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: 'red',
        width: 20,
        height: 20,
        angle: 45,
      });

      canvas.add(rect)
    return (<>
        <canvas  ref={canvasRef}></canvas>
    </>)
}



export default EditDemo;