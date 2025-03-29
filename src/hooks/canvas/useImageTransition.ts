import { ProgramInfoRefType, setFloatUniform, setImageUniform } from "gl-layer";
import { shiftLeft, shiftRight } from "@/utils/circularIndex";

export const useImageTransition = () => {
  const handleImageTransition = async (
    glRef: React.RefObject<WebGLRenderingContext | null>,
    programInfoRef: React.RefObject<ProgramInfoRefType | null>,
    texturesRef: React.RefObject<{ textures: WebGLTexture[] }>,
    index: number,
    setIndex: (index: number) => void,
    leftTrue: boolean,
    increaseRadius: (params: {
      duration: number;
      glRef: React.RefObject<WebGLRenderingContext | null>;
      programInfoRef: React.RefObject<ProgramInfoRefType | null>;
      end?: number;
      start?: number;
    }) => void,
  ) => {
    if (glRef.current && programInfoRef.current) {
      let currentIndex = index + 1;
      let previousIndex = index;
      let nextIndex = index + 2;

      if (!leftTrue) {
        const data = shiftLeft({
          index,
          length: texturesRef.current.textures.length,
        });
        currentIndex = data.current;
        previousIndex = data.previous;
        nextIndex = data.next;
      } else {
        const data = shiftRight({
          index,
          length: texturesRef.current.textures.length,
        });
        currentIndex = data.current;
        previousIndex = data.previous;
        nextIndex = data.next;
      }

      setIndex(currentIndex);
      setFloatUniform({
        gl: glRef.current,
        uniformLocation: programInfoRef.current.uniformLocations.uRadius,
        value: 0.2,
      });
      setFloatUniform({
        gl: glRef.current,
        uniformLocation: programInfoRef.current.uniformLocations.uTimeRange,
        value: 2.5,
      });
      setImageUniform({
        gl: glRef.current,
        texture: texturesRef.current.textures[previousIndex],
        uniformLocation:
          programInfoRef.current.uniformLocations.uTexturePrevious,
        index: 0,
        textureNumber: 0,
      });
      setImageUniform({
        gl: glRef.current,
        texture: texturesRef.current.textures[currentIndex],
        uniformLocation:
          programInfoRef.current.uniformLocations.uTextureCurrent,
        index: 1,
        textureNumber: 1,
      });
      setImageUniform({
        gl: glRef.current,
        texture: texturesRef.current.textures[nextIndex],
        uniformLocation: programInfoRef.current.uniformLocations.uTextureNext,
        index: 2,
        textureNumber: 2,
        render: true,
      });

      increaseRadius({
        duration: 1,
        glRef,
        programInfoRef,
        end: 0.2,
        start: 0,
      });
    }
  };

  return { handleImageTransition };
};
