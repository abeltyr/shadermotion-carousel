import { ProgramInfoRefType, setFloatUniform } from "gl-layer";
import { useCallback } from "react";
import gsap from "gsap";

export const useRadiusAnimation = () => {
  const increaseRadius = useCallback(
    ({
      glRef,
      programInfoRef,
      duration,
      start = 0.2,
      end = 2.5,
    }: {
      glRef: React.RefObject<WebGLRenderingContext | null>;
      programInfoRef: React.RefObject<ProgramInfoRefType | null>;
      duration: number;
      start?: number;
      end?: number;
    }) => {
      const obj = { value: start };
      gsap.to(obj, {
        value: end,
        duration: duration,
        ease: "power1.inOut",
        onUpdate: () => {
          if (glRef.current && programInfoRef.current) {
            setFloatUniform({
              gl: glRef.current,
              uniformLocation: programInfoRef.current.uniformLocations.uRadius,
              render: true,
              value: obj.value,
            });
          }
        },
      });
    },
    [],
  );

  return { increaseRadius };
};
