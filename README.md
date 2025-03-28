# ShaderMotion

A WebGL-based carousel component built on gl-layer, offering smooth transitions and shader-powered animations. This library provides an elegant solution for creating interactive image carousels with GPU-accelerated transitions and GSAP-powered animations.

## Overview

ShaderMotion is a TypeScript library that combines the power of WebGL and GSAP to create fluid image transitions. It provides a React component for easy integration, along with hooks for custom canvas management and shader effects.

## Features

- **WebGL-Powered Carousel**: Smooth, hardware-accelerated image transitions
- **GSAP Integration**: Professional animation timing and easing
- **Interactive Transitions**: Mouse-based interaction for direction control
- **Texture Management**: Efficient handling of image textures
- **Custom Shaders**: Built-in shader effects for transitions
- **Canvas Hooks**: React hooks for WebGL canvas management
- **Type Safety**: Full TypeScript support

## Installation

```bash
npm install shader-motion
```

## Usage

### Basic Carousel Component

```typescript
import { CarouselWebGL } from 'shader-motion';

const MyCarousel = () => {
  const images = [
    '/path/to/image1.jpg',
    '/path/to/image2.jpg',
    '/path/to/image3.jpg'
  ];

  return (
    <CarouselWebGL
      images={images}
      size={{ width: 800, height: 600 }}
    />
  );
};
```

## API Reference

### CarouselWebGL Component

```typescript
interface WebGLShapeProps {
  size: {
    width: number;
    height: number;
  };
  images: string[];     // Array of image URLs
}
```

### useLayoutCanvas Hook

```typescript
const { 
  initializer,      // Initialize WebGL context and shaders
  resizeUpdate,     // Handle canvas resize
  increaseRadius    // Trigger transition animations
} = useLayoutCanvas();
```

### Canvas Initialization

```typescript
interface CanvasInitProps {
  canvasRef: {
    buffersRef: React.RefObject<BuffersRefType>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    glRef: React.RefObject<WebGLRenderingContext>;
    programInfoRef: React.RefObject<ProgramInfoRefType>;
    loading: boolean;
    setLoading: (loading: boolean) => void;
  };
  shader: {
    fragmentShaderSource: string;
    vertexShaderSource: string;
  };
  uniforms: Record<string, any>;
  textures: WebGLTexture[];
}
```

## Dependencies

- React ^19.0.0
- GSAP ^3.12.7
- gl-layer ^0.1.3

## License

MIT