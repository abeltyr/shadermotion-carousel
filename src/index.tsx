'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BuffersRefType, loadImageTextures, ProgramInfoRefType, RenderSize, renderWebGL, setFloatUniform } from 'gl-layer';
import gsap from "gsap";
import { useLayoutCanvas } from './hooks/canvas/useCanvasHook';
import { shaders } from './canvas/shaders';
import { uniforms } from './canvas/uniforms/uniforms';

interface WebGLShapeProps {
    size: RenderSize;
    images: string[];
    className?: string;
}

export const CarouselWebGL: React.FC<WebGLShapeProps> = ({
    size,
    images,
    className = ''
}) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);  // Reference to the canvas DOM element
    const glRef = useRef<WebGLRenderingContext | null>(null);  // WebGL rendering context
    const programInfoRef = useRef<ProgramInfoRefType | null>(null);  // Stores compiled shader programs and attributes
    const buffersRef = useRef<BuffersRefType | null>(null);
    const texturesRef = useRef<{
        textures: WebGLTexture[]
    }>({ textures: [] });
    const [loading, setLoading] = useState(true);

    const { resizeUpdate, increaseRadius, initializer } = useLayoutCanvas();


    const mainCanvasSetter = useCallback(async () => {
        if (canvasRef.current) {
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
                textures
            });
        }
    }, [canvasRef.current, images])


    // Effect hook to reinitialize canvas when size changes
    useEffect(() => {
        mainCanvasSetter();
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


    const [index, setIndex] = useState(0);

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
        <div className='flex justify-center items-center h-screen flex-col'>
            <div className='border-4 border-gray-900 w-[532px] h-[532px] overflow-hidden'>
                <canvas
                    onClick={() => {
                        increaseRadius({ duration: 2, glRef, programInfoRef });
                        setTimeout(async () => {
                            if (glRef.current && programInfoRef.current) {

                                let currentIndex = index + 1;
                                let previousIndex = index;
                                let nextIndex = index + 2;

                                if (!leftTrue) {
                                    // Moving forward
                                    currentIndex = (index + 1) % texturesRef.current.textures.length;
                                    previousIndex = index;
                                    nextIndex = (currentIndex + 1) % texturesRef.current.textures.length;
                                } else {
                                    // Moving backward
                                    currentIndex = index - 1;
                                    if (currentIndex < 0) currentIndex = texturesRef.current.textures.length - 1;
                                    previousIndex = (currentIndex - 1 + texturesRef.current.textures.length) % texturesRef.current.textures.length;
                                    nextIndex = (currentIndex + 1) % texturesRef.current.textures.length;
                                }

                                setIndex(currentIndex)
                                glRef.current.activeTexture(glRef.current.TEXTURE0);
                                glRef.current.bindTexture(glRef.current.TEXTURE_2D, texturesRef.current.textures[currentIndex]);
                                glRef.current.uniform1i(programInfoRef.current.uniformLocations.uTextureCurrent, 0);

                                glRef.current.drawArrays(glRef.current.TRIANGLE_STRIP, 0, 4);
                                glRef.current.activeTexture(glRef.current.TEXTURE1);
                                glRef.current.bindTexture(glRef.current.TEXTURE_2D, texturesRef.current.textures[nextIndex]);
                                glRef.current.uniform1i(programInfoRef.current.uniformLocations.uTextureNext, 1);

                                glRef.current.drawArrays(glRef.current.TRIANGLE_STRIP, 0, 4);
                                glRef.current.activeTexture(glRef.current.TEXTURE2);
                                glRef.current.bindTexture(glRef.current.TEXTURE_2D, texturesRef.current.textures[previousIndex]);
                                glRef.current.uniform1i(programInfoRef.current.uniformLocations.uTexturePrevious, 2);

                                glRef.current.drawArrays(glRef.current.TRIANGLE_STRIP, 0, 4);

                                const obj = { value: 0 };

                                gsap.to(obj, {
                                    value: 0.2,
                                    duration: 1,
                                    ease: "power1.inOut",
                                    onUpdate: () => {
                                        console.log(obj.value); // You can use this value for UI updates

                                        if (glRef.current && programInfoRef.current) {
                                            glRef.current.uniform1f(programInfoRef.current.uniformLocations.uRadius, obj.value);
                                            glRef.current.drawArrays(glRef.current.TRIANGLE_STRIP, 0, 4);
                                        }
                                    },
                                    onComplete: () => {
                                        console.log("Animation complete!");
                                    }
                                });
                            }
                        }, 2100)

                    }}
                    onMouseMove={async (event) => {
                        const rect = event.currentTarget.getBoundingClientRect();
                        const x = event.clientX - rect.left;
                        const y = event.clientY - rect.top;
                        if (x >= 0 && y >= 0) {
                            if (glRef.current && programInfoRef.current) {

                                glRef.current.uniform2fv(
                                    programInfoRef.current.uniformLocations.uMouse,
                                    [x / 524, y / 524],
                                );
                                glRef.current.drawArrays(glRef.current.TRIANGLE_STRIP, 0, 4);

                                setLeftTrue(x / 524 < 0.5)
                            }
                        }
                    }}
                    ref={canvasRef}
                    className={`${className}`}
                    style={{ display: 'block' }}
                />
            </div>
        </div>
    );
};