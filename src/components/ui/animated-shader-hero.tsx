"use client";

import React, { useRef, useEffect } from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

interface HeroProps {
  trustBadge?: {
    text: string;
    icons?: string[];
  };
  headline: {
    line1: string;
    line2: string;
  };
  subtitle: string;
  buttons?: {
    primary?: {
      text: string;
      href?: string;
      onClick?: () => void;
    };
    secondary?: {
      text: string;
      href?: string;
      onClick?: () => void;
    };
  };
  className?: string;
}

const defaultShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float
  a=rnd(i),
  b=rnd(i+vec2(1,0)),
  c=rnd(i+vec2(0,1)),
  d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}
float clouds(vec2 p) {
    float d=1., t=.0;
    for (float i=.0; i<3.; i++) {
        float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
        t=mix(t,d,a);
        d=a;
        p*=2./(i+1.);
    }
    return t;
}
void main(void) {
    vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
    vec3 col=vec3(0);
    float bg=clouds(vec2(st.x+T*.5,-st.y));
    uv*=1.-.3*(sin(T*.2)*.5+.5);
    for (float i=1.; i<12.; i++) {
        uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
        vec2 p=uv;
        float d=length(p);
        // White sparkles
        col+=.00125/d*vec3(1.6);
        float b=noise(i+p+bg*1.731);
        col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
        // Pure grayscale tint — equal R/G/B forces no color cast. Darker = blacker.
        float g=bg*.07;
        col=mix(col,vec3(g),d);
    }
    // Force grayscale: collapse any residual channel imbalance.
    float lum=dot(col,vec3(.299,.587,.114));
    O=vec4(vec3(lum),1);
}`;

const vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

function startShader(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2");
  if (!gl) return () => {};
  let raf = 0;

  const dpr = () => Math.max(1, 0.5 * window.devicePixelRatio);
  let scale = dpr();

  const resize = () => {
    scale = dpr();
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();
  window.addEventListener("resize", resize);

  const vs = gl.createShader(gl.VERTEX_SHADER)!;
  gl.shaderSource(vs, vertexSrc);
  gl.compileShader(vs);
  const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(fs, defaultShaderSource);
  gl.compileShader(fs);
  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(fs));
  }
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Link error:", gl.getProgramInfoLog(program));
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, "resolution");
  const uTime = gl.getUniformLocation(program, "time");

  const render = (now: number) => {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, now * 1e-3);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    raf = requestAnimationFrame(render);
  };
  raf = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (buffer) gl.deleteBuffer(buffer);
  };
}

const Hero: React.FC<HeroProps> = ({
  trustBadge,
  headline,
  subtitle,
  buttons,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanup = startShader(canvasRef.current);
    return cleanup;
  }, []);

  const navigate = (href?: string) => {
    if (!href) return;
    if (href.startsWith("#")) {
      const target = document.querySelector(href);
      target?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = href;
    }
  };

  const handlePrimary = () => {
    navigate(buttons?.primary?.href);
    buttons?.primary?.onClick?.();
  };

  const handleSecondary = () => {
    navigate(buttons?.secondary?.href);
    buttons?.secondary?.onClick?.();
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-black ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover touch-none"
        style={{ background: "black" }}
      />

      {/* Vignette overlay — darkens the center so headline reads cleanly against sparkles */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 40%, transparent 75%)",
        }}
      />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white">
        {trustBadge && (
          <div className="mb-8 animate-fade-in-down">
            <div className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm">
              {trustBadge.icons && (
                <div className="flex gap-1">
                  {trustBadge.icons.map((icon, i) => (
                    <span key={i} className="text-zinc-200">
                      {icon}
                    </span>
                  ))}
                </div>
              )}
              <span className="text-zinc-200">{trustBadge.text}</span>
            </div>
          </div>
        )}

        <div className="text-center space-y-4 max-w-4xl mx-auto px-4">
          <div className="space-y-3">
            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-semibold text-white animate-fade-in-up animation-delay-200"
              style={{
                textShadow:
                  "0 2px 20px rgba(0,0,0,0.6), 0 0 40px rgba(0,0,0,0.4)",
              }}
            >
              {headline.line1}
            </h1>
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-light text-zinc-200 animate-fade-in-up animation-delay-400"
              style={{
                textShadow:
                  "0 2px 20px rgba(0,0,0,0.6), 0 0 40px rgba(0,0,0,0.4)",
              }}
            >
              {headline.line2}
            </h2>
          </div>

          {subtitle && (
            <div className="max-w-3xl mx-auto animate-fade-in-up animation-delay-600">
              <p className="text-lg md:text-xl lg:text-2xl text-zinc-300/90 font-light leading-relaxed">
                {subtitle}
              </p>
            </div>
          )}

          {buttons && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center mt-10 animate-fade-in-up animation-delay-800">
              {buttons.primary && (
                <LiquidButton
                  size="xl"
                  onClick={handlePrimary}
                  className="text-white text-base"
                >
                  {buttons.primary.text}
                </LiquidButton>
              )}
              {buttons.secondary && (
                <LiquidButton
                  size="xl"
                  onClick={handleSecondary}
                  className="text-white text-base"
                >
                  {buttons.secondary.text}
                </LiquidButton>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
