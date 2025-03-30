import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BuffersRefType, loadImageTextures, ProgramInfoRefType, RenderSize, setFloatUniform } from 'gl-layer';
import { useCanvasHooks } from '../hooks/canvas/useCanvasHook';
import { shaders } from '../canvas/shaders';
import { uniforms } from '../canvas/uniforms/uniforms';
import { WebGLShapeProps } from '../types/shared';

export const CarouselWebGL: React.FC<WebGLShapeProps> = ({
    size,
    images,
    mouse,
    radius,
    timeRange,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);  // Reference to the canvas DOM element
    const glRef = useRef<WebGLRenderingContext | null>(null);  // WebGL rendering context
    const programInfoRef = useRef<ProgramInfoRefType | null>(null);  // Stores compiled shader programs and attributes
    const buffersRef = useRef<BuffersRefType | null>(null);
    const texturesRef = useRef<{ textures: WebGLTexture[] }>({ textures: [] });
    const [loading, setLoading] = useState(true);

    // TODO: setup the middle Clicking animation
    // TODO: setup the time of the animation
    // TODO: setup the change to zero be smother
    // TODO: setup ui import for the loading or make the loading and setLoading be sent from the parent

    const {
        resizeUpdate,
        increaseRadius,
        initializer,
        handleImageTransition,
        handleMouseMove
    } = useCanvasHooks();

    const [index, setIndex] = useState(4);

    const canvasSetter = useCallback(async () => {
        if (canvasRef.current && containerRef.current) {
            const canvas = canvasRef.current;
            const gl = canvas.getContext("webgl");
            if (!gl) {
                console.error("Unable to initialize WebGL");
                return;
            }
            glRef.current = gl;
            const textures = await loadImageTextures({
                gl: gl,
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
                textures: texturesRef.current.textures,
                index,
                size,
                mouse,
                radius,
                timeRange
            });
            requestAnimationFrame(animate);
        }
    }, [canvasRef.current, images])

    // Effect hook to reinitialize canvas when size changes
    useEffect(() => {
        canvasSetter();
    }, [])

    // Effect hook to reinitialize canvas when size changes
    useEffect(() => {
        resizeUpdate({
            size,
            canvasDataSet: {
                buffersRef,
                canvasRef,
                glRef,
                programInfoRef,
                loading,
                setLoading,
            }
        })
    }, [size])



    const animate = (time: number) => {
        if (glRef.current && programInfoRef.current) {
            setFloatUniform({
                gl: glRef.current,
                render: true,
                uniformLocation: programInfoRef.current.uniformLocations.uTime,
                value: time * 0.001
            });
            requestAnimationFrame(animate);  // Call next frame}
        }
    }

    const [leftTrue, setLeftTrue] = useState(true)

    return (
        <div className='min-w-full min-h-full' ref={containerRef}>
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
        </div>
    );
};