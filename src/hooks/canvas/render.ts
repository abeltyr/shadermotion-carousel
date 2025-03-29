import { getCircularIndices } from "@/utils/circularIndex";
import {
  BuffersRefType,
  ProgramInfoRefType,
  RenderSize,
  renderWebGL,
  setFloatUniform,
  setImageUniform,
  setVec2Uniform,
} from "gl-layer";

export const render = async ({
  buffersRefCurrent,
  glRefCurrent,
  programInfoRefCurrent,
  sizeData,
  textures,
  index,
}: {
  glRefCurrent: WebGLRenderingContext;
  buffersRefCurrent: BuffersRefType;
  programInfoRefCurrent: ProgramInfoRefType;
  sizeData: RenderSize;
  textures: WebGLTexture[];
  index: number;
}) => {
  await renderWebGL({
    gl: glRefCurrent,
    buffersRefCurrent,
    programInfoRefCurrent,
    size: sizeData,
    secondLayer: () => {
      const { current, next, previous } = getCircularIndices({
        index,
        length: textures.length,
      });

      setFloatUniform({
        gl: glRefCurrent,
        uniformLocation: programInfoRefCurrent.uniformLocations.uRadius,
        value: 0.25,
      });

      setVec2Uniform({
        gl: glRefCurrent,
        uniformLocation: programInfoRefCurrent.uniformLocations.uMouse,
        value: {
          x: 0.5,
          y: 0.5,
        },
      });

      setFloatUniform({
        gl: glRefCurrent,
        uniformLocation: programInfoRefCurrent.uniformLocations.uTimeRange,
        value: 0.5,
      });

      setImageUniform({
        gl: glRefCurrent,
        texture: textures[previous],
        uniformLocation:
          programInfoRefCurrent.uniformLocations.uTexturePrevious,
        index: 1,
        textureNumber: glRefCurrent.TEXTURE1,
        render: true,
      });

      setImageUniform({
        gl: glRefCurrent,
        texture: textures[current],
        uniformLocation: programInfoRefCurrent.uniformLocations.uTextureCurrent,
        index: 2,
        textureNumber: glRefCurrent.TEXTURE2,
        render: true,
      });
      setImageUniform({
        gl: glRefCurrent,
        texture: textures[next],
        uniformLocation: programInfoRefCurrent.uniformLocations.uTextureNext,
        index: 3,
        textureNumber: glRefCurrent.TEXTURE3,
        render: true,
      });
    },
  });
};
