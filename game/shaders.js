const vertex = `#version 300 es
layout (location = 0) in vec4 aPosition;
layout (location = 1) in vec2 aTexCoord;
layout (location = 2) in vec3 aNormal;

uniform mat4 uViewModel;
uniform mat4 uProjection;

out vec2 vTexCoord;
out vec3 vPosition;

void main() {
    vTexCoord = aTexCoord;
    gl_Position = uProjection * uViewModel * aPosition;
    vPosition = (uViewModel * aPosition).xyz;
  
}
`;

const fragment = `#version 300 es
precision mediump float;

uniform mediump sampler2D uTexture;
uniform vec4 uFogColor;
uniform float uFogDensity;

in vec2 vTexCoord;
in vec3 vPosition;

out vec4 oColor;

void main() {

    vec4 color = texture(uTexture, vTexCoord);
    
    #define LOG2 1.442695
    
    float fogDistance = length(vPosition);
    float fogAmount = 1. - exp2(-uFogDensity * uFogDensity * fogDistance * fogDistance * LOG2);
    fogAmount = clamp(fogAmount, 0., 1.);
    oColor = mix(color, uFogColor, fogAmount);  
    
}
`;

export const shaders = {
    simple: { vertex, fragment }
};
