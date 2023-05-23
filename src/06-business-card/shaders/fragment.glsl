varying vec2 vUv;

uniform bool uColor;

void main()
{
    float strength = length(vUv);
    float rStrength = uColor ? vUv.x : strength;
    float gStrength = uColor ? vUv.y : strength;
    float bStrength = uColor ? 1.0 : strength;

    gl_FragColor = vec4(rStrength, gStrength, bStrength, 1.0);
}