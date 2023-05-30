#define PI 3.1415926535897932384626433832795
varying vec2 vUv;
uniform float uDegree;
uniform float uRedContent;
uniform float uBlueContent;


void main()
{
    float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
    float strength = mod(angle * uDegree, 1.0);

    gl_FragColor = vec4(uRedContent, strength, uBlueContent, 1.0);

}