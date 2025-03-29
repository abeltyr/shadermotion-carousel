import { getCircularIndices } from "@/utils/circularIndex";
import {
  BuffersRefType,
  ProgramInfoRefType,
  RenderSize,
  renderWebGL,
  setFloatUniform,
  setImageUniform,
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
  const { current, next, previous } = getCircularIndices({
    index,
    length: textures.length,
  });

  await renderWebGL({
    gl: glRefCurrent,
    buffersRefCurrent,
    programInfoRefCurrent,
    size: sizeData,
    secondLayer: () => {
      setFloatUniform({
        gl: glRefCurrent,
        uniformLocation: programInfoRefCurrent.uniformLocations.uRadius,
        value: 0.2,
      });
      setFloatUniform({
        gl: glRefCurrent,
        uniformLocation: programInfoRefCurrent.uniformLocations.uTimeRange,
        value: 2.5,
      });
      setImageUniform({
        gl: glRefCurrent,
        texture: textures[previous],
        uniformLocation:
          programInfoRefCurrent.uniformLocations.uTexturePrevious,
        index: 0,
        textureNumber: 0,
      });
      setImageUniform({
        gl: glRefCurrent,
        texture: textures[current],
        uniformLocation: programInfoRefCurrent.uniformLocations.uTextureCurrent,
        index: 1,
        textureNumber: 1,
      });
      setImageUniform({
        gl: glRefCurrent,
        texture: textures[next],
        uniformLocation: programInfoRefCurrent.uniformLocations.uTextureNext,
        index: 2,
        textureNumber: 2,
      });
    },
  });
};
