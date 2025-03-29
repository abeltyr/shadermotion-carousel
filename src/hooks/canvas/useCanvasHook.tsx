import { useCanvasInitializer } from './useCanvasInitializer';
import { useCanvasResize } from './useCanvasResize';
import { useRadiusAnimation } from './useRadiusAnimation';
import { useImageTransition } from './useImageTransition';
import { useMouseMove } from './useMouseMove';

export const useCanvasHooks = () => {
    const { initializer } = useCanvasInitializer();
    const { resizeUpdate } = useCanvasResize();
    const { increaseRadius } = useRadiusAnimation();
    const { handleImageTransition } = useImageTransition();
    const { handleMouseMove } = useMouseMove();

    return {
        initializer,
        resizeUpdate,
        increaseRadius,
        handleImageTransition,
        handleMouseMove
    };
};