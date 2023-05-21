varying vec2 vUv;
uniform float uDegree;
uniform bool uColor;

void main()
{
    float strength = length(vUv);
    
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}