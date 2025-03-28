'use client'

import { useCallback } from 'react';
import gsap from 'gsap';
import Lenis from 'lenis';
import { CanvasAnimationState, SizeType, Thresholds } from '@/types/shared';

export const useCanvasScrollAnimation = () => {
    const scrollControl = useCallback(
        ({
            mainCanvas,
            heroSectionThresholds,
            scroll,
            lenis,
            animationState,
            size
        }: {
            mainCanvas: {
                glRef: React.MutableRefObject<WebGLRenderingContext | null>;
                programInfoRef: React.MutableRefObject<any>;
            };
            heroSectionThresholds: Thresholds[];
            scroll: number;
            lenis?: Lenis;
            animationState: React.MutableRefObject<CanvasAnimationState>;
            size: SizeType;
        }) => {
            if (mainCanvas.glRef.current && mainCanvas.programInfoRef.current && scroll < heroSectionThresholds[0].end + 20) {
                if (!animationState.current.isAnimatingContent) {
                    if (scroll > heroSectionThresholds[0].start + 90 && scroll < heroSectionThresholds[0].end - 120 && lenis && lenis.direction === 1) {
                        animationState.current.isAnimatingContent = true;
                        animationState.current.lockMode = true;
                        lenis?.scrollTo(heroSectionThresholds[0].end - 120,
                            {
                                immediate: false,
                                duration: 1.2,
                                force: true,
                                lock: animationState.current.lockMode,
                                lerp: animationState.current.lerp,
                                onComplete: () => {
                                    animationState.current.isAnimatingContent = false;
                                    animationState.current.lockMode = false;
                                    if (mainCanvas.glRef.current && mainCanvas.programInfoRef.current) {
                                        let progressData = { value: 0.0 };
                                        gsap.to(progressData, {
                                            value: 1.0,
                                            duration: 0.5,
                                            ease: "power1.inOut",
                                            onUpdate: () => {
                                                if (mainCanvas.glRef.current && mainCanvas.programInfoRef.current && !animationState.current.isAnimatingContent) {
                                                    mainCanvas.glRef.current.uniform1f(mainCanvas.programInfoRef.current.uniformLocations.uProgress, progressData.value);
                                                    mainCanvas.glRef.current.drawArrays(mainCanvas.glRef.current.TRIANGLE_STRIP, 0, 4);
                                                }
                                            }
                                        });
                                    }
                                }
                            },
                        );
                    }

                    if (scroll > heroSectionThresholds[0].start && scroll < heroSectionThresholds[0].end - 120 && lenis && lenis.direction === -1) {
                        animationState.current.isAnimatingContent = true;
                        animationState.current.lockMode = true;
                        if (mainCanvas.glRef.current && mainCanvas.programInfoRef.current) {
                            mainCanvas.glRef.current.uniform1f(mainCanvas.programInfoRef.current.uniformLocations.uProgress, 0.0);
                            mainCanvas.glRef.current.drawArrays(mainCanvas.glRef.current.TRIANGLE_STRIP, 0, 4);
                        }
                        lenis?.scrollTo(heroSectionThresholds[0].start,
                            {
                                immediate: false,
                                duration: 1.3,
                                force: true,
                                lock: animationState.current.lockMode,
                                lerp: animationState.current.lerp,
                                onComplete: () => {
                                    animationState.current.isAnimatingContent = false;
                                    animationState.current.lockMode = false;
                                }
                            },
                        );
                    }
                }

                let scale = 3;

                if (size.width < 1000) {
                    scale = 2.4;
                }
                else if (size.width >= 1000) {
                    scale = 2.4;
                } else {
                    scale = 3;
                }

                const normalizedProgress = (scroll - heroSectionThresholds[0].start) / (heroSectionThresholds[0].end);
                let progress = Math.pow(normalizedProgress, 2) * scale;

                mainCanvas.glRef.current.uniform1f(mainCanvas.programInfoRef.current.uniformLocations.uRadius, progress);
                mainCanvas.glRef.current.drawArrays(mainCanvas.glRef.current.TRIANGLE_STRIP, 0, 4);
            }
        }, []);

    return {
        scrollControl
    };
};