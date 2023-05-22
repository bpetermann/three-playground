varying vec2 vUv;

uniform bool uColor;

void main()
{
    float strength = length(vUv);
    float rColor = uColor ? 0.4 : strength;
    float bColor = uColor ? 0.8 : strength;

    gl_FragColor = vec4(rColor, strength, bColor, 1.0);
}