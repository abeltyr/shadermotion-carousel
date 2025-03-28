export const fragmentShaderSource = `  
    precision mediump float;

    uniform vec2 uResolution;
    uniform float uTime;
    uniform sampler2D uTextureCurrent;   // Current image
    uniform sampler2D uTextureNext;     // Next image
    uniform sampler2D uTexturePrevious;     // Back image
    uniform vec2 uMouse;             // Mouse position in normalized coordinates [0,1]
    uniform float uRadius;           // Base radius of the reveal area
    uniform float uTimeRange;           // Base radius of the reveal area

    // Fake noise function using sin()
    float noise(vec2 uv) {
        return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
        vec2 uv = gl_FragCoord.xy / uResolution;

        // rotate Y
        uv.y = 1.0 - uv.y;
        
        // Make the radius oscillate over time
        float dynamicRadius = uRadius + sin(uTime * uTimeRange) * 0.005;

        // Compute distance from mouse position
        float dist = length(uv - uMouse);
        
        // Add randomness to create an irregular shape
        float randomOffset = noise(uv * 50.0) * 0.05;
        
        // Final "cloudy" mask with gaps
        float cloudMask = smoothstep(dynamicRadius  + randomOffset, dynamicRadius * 0.48, dist);

        // Sample both textures
        vec4 currentColor = texture2D(uTextureCurrent, uv);
        vec4 nextColor = texture2D(uTextureNext, uv);
        vec4 previousColor = texture2D(uTexturePrevious, uv);

        // Blend images based on the distorted reveal mask
        vec4 finalColor = mix(currentColor, nextColor, cloudMask);

        if(uMouse.x <= 0.6 ){
            float mixValue = (0.6 - uMouse.x)/0.2;
            if(uMouse.x < 0.4) mixValue=1.0;
            vec4 mixture = mix(nextColor, previousColor,mixValue);
            finalColor = mix(currentColor, mixture, cloudMask);
        }
        gl_FragColor = finalColor;
    }

`;
