export const vertexShader = `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;
// Fragment shader (fire effect)
export const fragmentShader = `
    uniform float time;
    uniform float intensity;
    
    void main() {
      float flame = sin(time * 10.0) * intensity;
      vec3 flameColor = vec3(flame, flame * 0.3, 0.0);
      gl_FragColor = vec4(flameColor, 1.0);
    }
    `;