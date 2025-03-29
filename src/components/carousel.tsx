import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BuffersRefType, loadImageTextures, ProgramInfoRefType, setFloatUniform } from 'gl-layer';
import { useCanvasHooks } from '../hooks/canvas/useCanvasHook';
import { shaders } from '../canvas/shaders';
import { uniforms } from '../canvas/uniforms/uniforms';
import { WebGLShapeProps } from '../types/shared';

export const CarouselWebGL: React.FC<WebGLShapeProps> = ({
    size,
    images,
}) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);  // Reference to the canvas DOM element
    const glRef = useRef<WebGLRenderingContext | null>(null);  // WebGL rendering context
    const programInfoRef = useRef<ProgramInfoRefType | null>(null);  // Stores compiled shader programs and attributes
    const buffersRef = useRef<BuffersRefType | null>(null);
    const texturesRef = useRef<{ textures: WebGLTexture[] }>({ textures: [] });
    const [loading, setLoading] = useState(true);

    const {
        resizeUpdate,
        increaseRadius,
        initializer,
        handleImageTransition,
        handleMouseMove
    } = useCanvasHooks();

    const [index, setIndex] = useState(1);

    const canvasSetter = useCallback(async () => {
        if (canvasRef.current && glRef.current) {
            const textures = await loadImageTextures({
                gl: glRef.current,
                images: images
            })
            texturesRef.current = { textures: [...textures] }
            await initializer({
                canvasRef: {
                    buffersRef,
                    canvasRef,
                    glRef,
                    loading,
                    programInfoRef,
                    setLoading,
                },
                shader: {
                    fragmentShaderSource: shaders.carousel.fragmentShaderSource,
                    vertexShaderSource: shaders.carousel.vertexShaderSource,
                },
                uniforms: uniforms.carousel,
                textures,
                index
            });
        }
    }, [canvasRef.current, images])

    // Effect hook to reinitialize canvas when size changes
    useEffect(() => {
        canvasSetter();
    }, [canvasRef.current, loading])

    // Effect hook to reinitialize canvas when size changes
    useEffect(() => {
        resizeUpdate({
            buffersRef,
            canvasRef,
            glRef,
            programInfoRef,
            loading,
            setLoading
        })
    }, [size])



    // Effect hook to reinitialize canvas when size changes
    useEffect(() => {
        if (loading) {
            requestAnimationFrame(animate);
        }
    }, [canvasRef.current])

    const animate = (time: number) => {
        if (glRef.current && programInfoRef.current) {
            const seconds = time * 0.001; // Convert time (milliseconds) to seconds
            setFloatUniform({
                gl: glRef.current,
                render: true,
                uniformLocation: programInfoRef.current.uniformLocations.uTime,
                value: seconds
            });
            requestAnimationFrame(animate);  // Call next frame}
        }
    }

    const [leftTrue, setLeftTrue] = useState(true)

    return (
        <canvas
            onClick={() => {
                increaseRadius({ duration: 2, glRef, programInfoRef });
                setTimeout(async () => {
                    await handleImageTransition(glRef, programInfoRef, texturesRef, index, setIndex, leftTrue, increaseRadius);
                }, 2100)
            }}
            onMouseMove={(event) => handleMouseMove({ event, size, glRef, programInfoRef, setLeftTrue })}
            ref={canvasRef}
            style={{
                display: 'block',
                width: '100%',
                height: '100%',
            }}
            width={size.width}
            height={size.height}
        />
    );
};