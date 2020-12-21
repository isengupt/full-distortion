
export var fragment = `

uniform float time;
uniform float progress;
uniform float speed;
uniform vec2 mouse;
uniform float direction;
uniform sampler2D texture;
uniform sampler2D texture2;
uniform vec4 resolution;
varying vec2 vUv;
varying vec4 vPosition;


void main()	{
    float normSpeed = clamp(speed*40.,0.,1.);
    float mouseDist = length(vUv - mouse);

    float c = smoothstep(0.2*normSpeed, 0., mouseDist);
    vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
    vec4 color1 = texture2D(texture, newUV);

    float r = texture2D(texture, newUV + 0.1 * 0.5 * c*normSpeed).r;
    float g = texture2D(texture, newUV + 0.1 * 0.3 * c*normSpeed).g;
    float b = texture2D(texture, newUV + 0.1 * 0.1 * c*normSpeed).b;

    gl_FragColor = vec4(vUv, 0.0,1.);
    gl_FragColor = color1;

    gl_FragColor = vec4(normSpeed * mouseDist,0., 0.,1.);
    gl_FragColor = vec4(c,0., 0.,1.);
    gl_FragColor = vec4(r,g, b,1.);
}
`;