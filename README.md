# GL-Layer

A lightweight WebGL setup layer that simplifies renderer management, uniform handling, and cleanup.

## Overview

GL-Layer is a TypeScript library designed to streamline WebGL development by providing a centralized set of utilities for canvas setup, shader management, uniform handling, and proper resource cleanup. It abstracts away the boilerplate code typically required when working with WebGL, allowing developers to focus on shader development and rendering logic.

## Features

- **WebGL Context Initialization**: Simple API for setting up WebGL context with proper configuration
- **Shader Program Management**: Utilities for loading, compiling, and linking shader programs
- **Buffer Management**: Easy creation and management of vertex buffers
- **Uniform Handling**: Type-safe utilities for setting various uniform types (float, vec2, vec3, vec4, textures)
- **Texture Loading**: Async utilities for loading and binding textures
- **Resource Cleanup**: Proper disposal of WebGL resources to prevent memory leaks
- **Rendering Utilities**: Simplified rendering pipeline with support for custom uniforms

## Installation

```bash
npm install gl-layer
```

## Usage

### Basic Setup

```typescript
import {
  initializeWebGL,
  renderWebGL,
  cleanupWebGLResources
} from 'gl-layer';

// Get canvas element
const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;

// Get WebGL context
const gl = canvas.getContext('webgl');
if (!gl) {
  console.error('Unable to initialize WebGL');
  return;
}

// Define shaders
const vertexShaderSource = `
  attribute vec4 aVertexPosition;
  void main() {
    gl_Position = aVertexPosition;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform vec2 uResolution;
  uniform float uTime;
  
  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    gl_FragColor = vec4(uv, sin(uTime) * 0.5 + 0.5, 1.0);
  }
`;

// Initialize WebGL with shaders and uniforms
const { programInfoRefCurrent, buffersRefCurrent } = initializeWebGL({
  gl,
  shader: {
    vertexShaderSource,
    fragmentShaderSource
  },
  uniforms: [
    { uniformName: 'uTime', webglName: 'uTime' },
    { uniformName: 'uResolution', webglName: 'uResolution' }
  ]
});

// Render function
function render() {
  renderWebGL({
    gl,
    programInfoRefCurrent,
    buffersRefCurrent,
    size: {
      width: canvas.width,
      height: canvas.height
    }
  });
}

// Animation loop
function animate(time) {
  setFloatUniform({
    gl:glRef.current,
     uniformLocation: programInfoRef.current.uniformLocations.uTime,
      value: seconds, 
      render: true
  })
  requestAnimationFrame(animate);
}

// Start animation
requestAnimationFrame(animate);

// Cleanup when done
function cleanup() {
  cleanupWebGLResources(canvas);
}
```

### React Integration Example

Here's how to use GL-Layer with React hooks:

```tsx
import React, { useEffect, useRef, useCallback } from 'react';
// custom shaders
import { shaders } from 'shaders';
import {
  initializeWebGL,
  renderWebGL,
  cleanupWebGLResources,

} from 'gl-layer';

const WebGLCanvas = ({ shaders, uniforms, size }) => {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const programInfoRef = useRef(null);
  const buffersRef = useRef(null);
  
  // Initialize WebGL context and shaders
  const initializer = useCallback(async (canvas, size) => {
    if (size.width > 0 && size.height > 0) {
      canvas.width = size.width;
      canvas.height = size.height;
      
      const gl = canvas.getContext('webgl');
      if (!gl) {
        console.error('Unable to initialize WebGL');
        return;
      }
      glRef.current = gl;
      
      const data = initializeWebGL({
        gl,
        shader: {
          fragmentShaderSource: shaders.layout.fragmentShaderSource,
          vertexShaderSource: shaders.layout.vertexShaderSource,
        },
        uniforms: shaders.layout.uniform
      });
      
      if (data) {
        programInfoRef.current = data.programInfoRefCurrent;
        buffersRef.current = data.buffersRefCurrent;
        
        // Initial render
        renderWebGL({
          gl,
          buffersRefCurrent: data.buffersRefCurrent,
          programInfoRefCurrent: data.programInfoRefCurrent,
          size
        });
      }
    }
  }, [shaders, size]);
  
  // Animation function
  const animate = useCallback((time) => {
    if (glRef.current && programInfoRef.current) {
      const seconds = time * 0.001; // Convert time to seconds
      setFloatUniform({gl:glRef.current, uniformLocation: programInfoRef.current.uniformLocations.uTime, value: seconds, render: true})
      requestAnimationFrame(animate);
    }
  }, []);
  
  // Initialize on mount
  useEffect(() => {
    if (canvasRef.current && size.width > 0) {
      initializer(canvasRef.current, size);
      requestAnimationFrame(animate);
    }
  }, [canvasRef.current, size, initializer, animate]);
  
  // Handle resize
  useEffect(() => {
    if (canvasRef.current && glRef.current) {
      canvasRef.current.width = size.width;
      canvasRef.current.height = size.height;
      glRef.current.viewport(0, 0, size.width, size.height);
      
      renderWebGL({
        gl: glRef.current,
        buffersRefCurrent: buffersRef.current,
        programInfoRefCurrent: programInfoRef.current,
        size
      });
    }
  }, [size]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupWebGLResources(canvasRef.current);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      width={size.width}
      height={size.height}
    />
  );
};

export default WebGLCanvas;
```

## API Reference

### Initialization

#### `initializeWebGL(options)`

Initializes WebGL context with shaders and uniforms.

```typescript
const { programInfoRefCurrent, buffersRefCurrent } = initializeWebGL({
  gl: WebGLRenderingContext,
  shader: {
    fragmentShaderSource: string,
    vertexShaderSource: string
  },
  uniforms?: {
    uniformName: string,
    webglName: string
  }[],
  attributes?: {
    attributeName: string,
    webglName: string
  }[]
});
```

### Rendering

#### `renderWebGL(options)`

Renders the WebGL scene with the current program and buffers.

```typescript
renderWebGL({
  gl: WebGLRenderingContext,
  programInfoRefCurrent: any,
  buffersRefCurrent: any,
  size: {
    width: number,
    height: number
  },
  secondLayer?: () => void // Optional callback for additional rendering
});
```

### Uniform Handling

#### Float Uniforms

```typescript
setFloatUniform({
  gl: WebGLRenderingContext,
  uniformLocation: WebGLUniformLocation,
  value: number,
  render: boolean // Whether to render immediately after setting
});
```

#### Vector Uniforms

```typescript
setVec2Uniform({
  gl: WebGLRenderingContext,
  uniformLocation: WebGLUniformLocation,
  value: { x: number, y: number },
  render: boolean
});

setVec3Uniform({
  gl: WebGLRenderingContext,
  uniformLocation: WebGLUniformLocation,
  value: { x: number, y: number, z: number },
  render: boolean
});

setVec4Uniform({
  gl: WebGLRenderingContext,
  uniformLocation: WebGLUniformLocation,
  value: { x: number, y: number, z: number, a: number },
  render: boolean
});
```

#### Texture Uniforms

```typescript
setImageUniform({
  gl: WebGLRenderingContext,
  textureNumber: number, // e.g., gl.TEXTURE0
  texture: WebGLTexture | string, // Can be a texture object or URL
  uniformLocation: WebGLUniformLocation,
  index: number,
  render: boolean
});
```

### Texture Loading

#### `loadTexture(gl, url)`

Loads a texture from a URL.

```typescript
const texture = await loadTexture(gl, 'path/to/image.jpg');
```

#### `loadImageTextures(options)`

Loads multiple textures from URLs.

```typescript
const textures = await loadImageTextures({
  gl: WebGLRenderingContext,
  images: string[] // Array of image URLs
});
```

### Cleanup

#### `cleanupWebGLResources(canvas)`

Cleans up WebGL resources to prevent memory leaks.

```typescript
cleanupWebGLResources(canvas);
```

## Utilities
****
#### `hexToNormalizedRGB(hex)`

Converts a hex color string to normalized RGB values.

```typescript
const { r, g, b } = hexToNormalizedRGB('#ff0000');
// r: 1.0, g: 0.0, b: 0.0
```

## License

MIT