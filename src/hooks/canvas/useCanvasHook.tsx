'use client'

import { RenderSize, CanvasRefType, renderWebGL, setFloatUniform, ProgramInfoRefType } from 'gl-layer';
import { initializeWebGL, WebGLUniform } from 'gl-layer';
import { useCallback } from 'react';
import { render } from './render';

export const useLayoutCanvas = () => {
    // Callback to initialize canvas with current dimensions
    const initializer = useCallback(async ({
        canvasRef,
        shader,
        uniforms, textures
    }:
        {
            canvasRef: CanvasRefType,
            shader: {
                fragmentShaderSource: string;
                vertexShaderSource: string;
            },
            uniforms: WebGLUniform[],
            textures: WebGLTexture[];
        }
    ) => {
        const canvas = canvasRef.canvasRef.current;
        const size = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        if (size.width > 0 && size.height > 0 && canvas) {
            canvas.width = size.width;
            canvas.height = size.height;

            const gl = canvas.getContext("webgl");
            if (!gl) {
                console.error("Unable to initialize WebGL");
                return;
            }
            canvasRef.glRef.current = gl;
            const data = initializeWebGL({
                gl,
                shader: {
                    fragmentShaderSource: shader.fragmentShaderSource,
                    vertexShaderSource: shader.vertexShaderSource,
                },
                uniforms: uniforms
            });

            if (data) {
                canvasRef.programInfoRef.current = await data.programInfoRefCurrent;
                canvasRef.buffersRef.current = await data.buffersRefCurrent;
                render({
                    buffersRefCurrent: data.buffersRefCurrent,
                    glRefCurrent: gl,
                    programInfoRefCurrent: data.programInfoRefCurrent,
                    sizeData: size,
                    textures
                });
                canvasRef.setLoading(false);
            }
        }
    }, []);

    const resizeUpdate = useCallback(async (canvasDataSet: CanvasRefType) => {
        if (canvasDataSet.loading) return;
        if (canvasDataSet.canvasRef.current && canvasDataSet.programInfoRef.current && canvasDataSet.buffersRef.current) {
            const size = {
                width: window.innerWidth,
                height: window.innerHeight
            }
            canvasDataSet.canvasRef.current.width = size.width;
            canvasDataSet.canvasRef.current.height = size.height;
            const gl = canvasDataSet.canvasRef.current.getContext("webgl");
            if (gl) {
                canvasDataSet.glRef.current = gl;
                gl.viewport(0, 0, canvasDataSet.canvasRef.current.width, canvasDataSet.canvasRef.current.height);

                await renderWebGL({
                    buffersRefCurrent: canvasDataSet.buffersRef.current,
                    gl: canvasDataSet.glRef.current,
                    programInfoRefCurrent: canvasDataSet.programInfoRef.current,
                    size,
                    secondLayer: () => {
                    },
                });
            }
        }
    }, []);

    const increaseRadius = useCallback(({ glRef, programInfoRef, duration, start = 0.2, end = 2.5 }: {
        glRef: React.RefObject<WebGLRenderingContext | null>,
        programInfoRef: React.RefObject<ProgramInfoRefType | null>
        duration: number, start?: number, end?: number
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
                        value: obj.value
                    })
                }
            },
        });
    }, [])


    return {
        initializer,
        resizeUpdate,
        increaseRadius
    };
};