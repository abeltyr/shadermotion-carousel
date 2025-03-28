
export type CanvasRefType = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    glRef: React.RefObject<WebGLRenderingContext | null>;
    programInfoRef: React.RefObject<ProgramInfoRefType | null>;
    buffersRef: React.RefObject<BuffersRefType | null>;
    loading: boolean;
    setLoading: (value: boolean) => void;
};

export type ProgramInfoRefType = {
    program: WebGLProgram;
    attribLocations: {
        vertexPosition: number;
    };
    uniformLocations: {
        [x: string]: WebGLUniformLocation;
    };
};

export type BuffersRefType = {
    position: WebGLBuffer;
};
