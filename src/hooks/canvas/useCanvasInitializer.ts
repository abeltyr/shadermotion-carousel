import {
  CanvasRefType,
  initializeWebGL,
  RenderSize,
  WebGLUniform,
} from "gl-layer";
import { render } from "./render";

export const useCanvasInitializer = () => {
  const initializer = async ({
    canvasRef,
    shader,
    uniforms,
    textures,
    index,
    size,
  }: {
    canvasRef: CanvasRefType;
    shader: {
      fragmentShaderSource: string;
      vertexShaderSource: string;
    };
    uniforms: WebGLUniform[];
    textures: WebGLTexture[];
    index: number;
    size: RenderSize;
  }) => {
    const canvas = canvasRef.canvasRef.current;

    if (canvas && size.width > 0 && size.height > 0) {
      canvas.width = size.width;
      canvas.height = size.height;

      let gl = canvasRef.glRef.current;
      if (!canvasRef.glRef.current) {
        gl = canvas.getContext("webgl");
        canvasRef.glRef.current = gl;
      }

      if (!gl) {
        console.error("Unable to initialize WebGL");
        return;
      }
      const data = initializeWebGL({
        gl,
        shader: {
          fragmentShaderSource: shader.fragmentShaderSource,
          vertexShaderSource: shader.vertexShaderSource,
        },
        uniforms: uniforms,
        vertexPositionName: "aPosition",
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
