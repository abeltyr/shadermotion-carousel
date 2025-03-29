import { ProgramInfoRefType, setVec2Uniform } from "gl-layer";
import { useCallback } from "react";

export const useMouseMove = () => {
  const handleMouseMove = useCallback(
    ({
      event,
      size,
      glRef,
      programInfoRef,
      setLeftTrue,
    }: {
      event: React.MouseEvent<HTMLCanvasElement>;
      size: { width: number; height: number };
      glRef: React.RefObject<WebGLRenderingContext | null>;
      programInfoRef: React.RefObject<ProgramInfoRefType | null>;
      setLeftTrue: (value: boolean) => void;
    }) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x >= 0 && y >= 0) {
        if (glRef.current && programInfoRef.current) {
          setVec2Uniform({
            gl: glRef.current,
            render: true,
            uniformLocation: programInfoRef.current.uniformLocations.uMouse,
            value: {
              x: x / size.width,
              y: y / size.height,
            },
          });
          setLeftTrue(x / size.width < 0.5);
        }
      }
    },
    [],
  );

  return { handleMouseMove };
};
