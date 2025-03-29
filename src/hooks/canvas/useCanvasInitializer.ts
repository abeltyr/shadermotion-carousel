import { CanvasRefType, initializeWebGL, WebGLUniform } from "gl-layer";
import { render } from "./render";

export const useCanvasInitializer = () => {
  const initializer = async ({
    canvasRef,
    shader,
    uniforms,
    textures,
    index,
  }: {
    canvasRef: CanvasRefType;
    shader: {
      fragmentShaderSource: string;
      vertexShaderSource: string;
    };
    uniforms: WebGLUniform[];
    textures: WebGLTexture[];
    index: number;
  }) => {
    const canvas = canvasRef.canvasRef.current;
    const size = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    if (size.width > 0 && size.height > 0 && canvas) {
      canvas.width = size.width;
      canvas.height = size.height;

      const gl = canvas.getContext("webgl");
      if (!gl) {
        console.error("Unable to initialize WebGL");
        return;
      }
      canvasRef.glRef.current = gl;
      const data = initializeWebGL({
        gl,
        shader: {
          fragmentShaderSource: shader.fragmentShaderSource,
          vertexShaderSource: shader.vertexShaderSource,
        },
        uniforms: uniforms,
      });

      if (data) {
        canvasRef.programInfoRef.current = await data.programInfoRefCurrent;
        canvasRef.buffersRef.current = await data.buffersRefCurrent;
        render({
          buffersRefCurrent: data.buffersRefCurrent,
          glRefCurrent: gl,
          programInfoRefCurrent: data.programInfoRefCurrent,
          sizeData: size,
          textures,
          index,
        });
        canvasRef.setLoading(false);
      }
    }
  };

  return { initializer };
};
