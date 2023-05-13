varying vec2 vUv;
uniform float uDegree;

void main()
{
    float values = 1.0 - step(0.01, abs(distance(vec2(
        vUv.x + sin(vUv.y * uDegree) * 0.1,
        vUv.y + sin(vUv.x * uDegree) * 0.1
    ), vec2(0.5)) -0.25));

    gl_FragColor = vec4(values, values, values, 1.0);

}