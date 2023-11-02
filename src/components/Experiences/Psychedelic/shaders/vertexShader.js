export const vertexShader = `

uniform float uTime;
uniform float uSize;
varying float vSize;
varying float vTime;
varying vec2 vUv;


void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vUv = uv;
    vTime = uTime;
    vSize = uSize;
}
`;
