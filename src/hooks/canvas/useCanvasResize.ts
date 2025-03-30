import { CanvasRefType, RenderSize, renderWebGL } from "gl-layer";

export const useCanvasResize = () => {
  const resizeUpdate = async ({
    canvasDataSet,
    size,
  }: {
    canvasDataSet: CanvasRefType;
    size: RenderSize;
  }) => {
    if (canvasDataSet.loading) return;
    if (
      canvasDataSet.canvasRef.current &&
      canvasDataSet.programInfoRef.current &&
      canvasDataSet.buffersRef.current
    ) {
      canvasDataSet.canvasRef.current.width = size.width;
      canvasDataSet.canvasRef.current.height = size.height;
      const gl = canvasDataSet.canvasRef.current.getContext("webgl");
      if (gl) {
        canvasDataSet.glRef.current = gl;
        gl.viewport(
          0,
          0,
          canvasDataSet.canvasRef.current.width,
          canvasDataSet.canvasRef.current.height,
        );

        await renderWebGL({
          buffersRefCurrent: canvasDataSet.buffersRef.current,
          gl: canvasDataSet.glRef.current,
          programInfoRefCurrent: canvasDataSet.programInfoRef.current,
          size,
          secondLayer: () => {},
        });
      }
    }
  };

  return { resizeUpdate };
};
