import { RenderSize } from 'gl-layer';

export interface WebGLShapeProps {
    size: RenderSize;
    images: string[];
    className?: string;
    radius?: number;
    mouse?: { x: number; y: number };
    timeRange?: number;
}
