varying vec2 vUv;
uniform float uDegree;
uniform bool uColor;

void main()
{
    float values = 1.0 - step(0.01, abs(distance(vec2(
        vUv.x + sin(vUv.y * uDegree) * 0.1,
        vUv.y + sin(vUv.x * uDegree) * 0.1
    ), vec2(0.5)) -0.25));

    vec3 black = vec3(0.0);
    vec3 colored = vec3(vUv, 0.5);
    vec3 white = vec3(1.0);
    vec3 topColor = uColor ? colored : white;
    vec3 mixedColor = mix(black, topColor, values);

    gl_FragColor = vec4(mixedColor, 1.0);

}