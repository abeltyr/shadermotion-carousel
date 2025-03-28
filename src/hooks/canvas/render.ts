import {
  BuffersRefType,
  ProgramInfoRefType,
  RenderSize,
  renderWebGL,
  setImageUniform,
} from "gl-layer";

export const render = async ({
  buffersRefCurrent,
  glRefCurrent,
  programInfoRefCurrent,
  sizeData,
  textures,
}: {
  glRefCurrent: WebGLRenderingContext;
  buffersRefCurrent: BuffersRefType;
  programInfoRefCurrent: ProgramInfoRefType;
  sizeData: RenderSize;
  textures: WebGLTexture[];
}) => {
  await renderWebGL({
    gl: glRefCurrent,
    buffersRefCurrent,
    programInfoRefCurrent,
    size: sizeData,
    secondLayer: () => {
      setImageUniform({
        gl: glRefCurrent,
        texture: textures[0],
        uniformLocation:
          programInfoRefCurrent.uniformLocations.uTexturePrevious,
        render: false,
        index: 0,
        textureNumber: 0,
      });
      setImageUniform({
        gl: glRefCurrent,
        texture: textures[1],
        uniformLocation: programInfoRefCurrent.uniformLocations.uTextureCurrent,
        render: false,
        index: 1,
        textureNumber: 1,
      });
      setImageUniform({
        gl: glRefCurrent,
        texture: textures[2],
        uniformLocation: programInfoRefCurrent.uniformLocations.uTextureNext,
        render: false,
        index: 2,
        textureNumber: 2,
      });
    },
  });
};
