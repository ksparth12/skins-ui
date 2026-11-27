import { useEffect, useRef, type ComponentPropsWithRef } from "react";

type Speed = "still" | "slow" | "medium";

export type BackgroundProps = ComponentPropsWithRef<"div"> & {
  /** Still draws one frame and stops. Reduced motion always holds still. */
  speed?: Speed;
  /** A fine film grain over the colour. */
  grain?: boolean;
};

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

/*
 * Dither: your colour stepping down into a near-black shade of itself in four flat tones, blended by a
 * fine ordered dither, like a print from an early screen. Only the light underneath drifts; the dither
 * grid itself never moves, so it reads as texture and never buzzes.
 *
 * Colours are read from the Hue tokens and glide when they change. Drawing pauses when the field is
 * off screen or the tab is hidden, and holds one still frame under reduced motion.
 */
const RATE: Record<Speed, number> = { still: 0, slow: 0.03, medium: 0.07 };
const TOKENS = ["--sk-hue-deep", "--sk-hue-900", "--sk-accent", "--sk-hue-300"] as const;

const VERTEX = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAGMENT = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uC0, uC1, uC2, uC3;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 s = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), s.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), s.x), s.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}
// A fine ordered dither so the long gradients never band.
float dither() { return (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0; }

// The classic ordered threshold, built up from a two by two pattern without bit operations.
float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }
void main() {
  // Each cell is 3 CSS pixels and takes one tone, measured at its centre, so the grid stays crisp.
  vec2 cell = floor(gl_FragCoord.xy / 3.0);
  vec2 uv = (cell + 0.5) * 3.0 / uRes;
  vec2 p = (uv * 2.0 - 1.0) * vec2(uRes.x / uRes.y, 1.0);
  float t = uTime * 0.3;
  // Light falls from the top, with a slow, soft warp so the tones drift like weather.
  float w = fbm(p * 0.8 + vec2(t * 0.35, -t * 0.25));
  float light = uv.y * 0.85 + (w - 0.5) * 0.9 + 0.12 * sin(p.x * 1.3 + t * 1.4) + 0.05;
  float v = clamp(light, 0.0, 0.999) * 3.0;
  float level = floor(v + bayer8(cell));
  vec3 col = uC0;
  if (level >= 1.0) col = uC1;
  if (level >= 2.0) col = uC2;
  if (level >= 3.0) col = uC3;
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Reads token colours as sRGB, whatever format they are written in. */
function readColours(el: Element): number[][] {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const style = getComputedStyle(el);
  return TOKENS.map((name) => {
    if (!ctx) return [0, 0, 0];
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = style.getPropertyValue(name).trim() || "black";
    ctx.fillRect(0, 0, 1, 1);
    const [r = 0, g = 0, b = 0] = ctx.getImageData(0, 0, 1, 1).data;
    return [r / 255, g / 255, b / 255];
  });
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function Grain() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full opacity-[0.16] mix-blend-overlay">
      <filter id="sk-dither-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#sk-dither-grain)" />
    </svg>
  );
}

export function Background({ speed = "slow", grain = false, className, children, ...rest }: BackgroundProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const el = host.current;
    const gl = canvas?.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!canvas || !el || !gl) return;

    // Without a working shader the base colour behind the canvas shows on its own.
    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(program, name);
    const uniforms = { res: u("uRes"), time: u("uTime"), colours: ["uC0", "uC1", "uC2", "uC3"].map(u) };

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rate = reduced ? 0 : (RATE[speed] ?? RATE.slow);
    let current = readColours(el);
    let target = current;
    let time = 4.0;
    let last = performance.now();
    let visible = true;
    let frame = 0;

    const resize = () => {
      const dpr = 1;
      canvas.width = Math.max(1, Math.round(el.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(el.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt * rate * 10;
      // Glide towards new colours over a few frames, or jump when motion is reduced.
      const k = reduced ? 1 : 1 - Math.pow(0.001, dt);
      current = current.map((c, i) => c.map((v, j) => v + ((target[i]?.[j] ?? v) - v) * k));
      gl.uniform2f(uniforms.res, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, time);
      uniforms.colours.forEach((l, i) => gl.uniform3fv(l, current[i] ?? [0, 0, 0]));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      const settling = current.some((c, i) => c.some((v, j) => Math.abs(v - (target[i]?.[j] ?? v)) > 0.002));
      if (visible && !document.hidden && (rate > 0 || settling)) frame = requestAnimationFrame(draw);
      else frame = 0;
    };
    const wake = () => {
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(draw);
      }
    };

    const sizes = new ResizeObserver(() => {
      resize();
      wake();
    });
    sizes.observe(el);
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) wake();
    });
    seen.observe(el);
    // Hue and theme changes arrive as new styles in <head> or a class on <html>.
    const recolour = new MutationObserver(() => {
      target = readColours(el);
      wake();
    });
    recolour.observe(document.head, { childList: true, subtree: true, characterData: true });
    recolour.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    document.addEventListener("visibilitychange", wake);

    resize();
    wake();
    return () => {
      cancelAnimationFrame(frame);
      sizes.disconnect();
      seen.disconnect();
      recolour.disconnect();
      document.removeEventListener("visibilitychange", wake);
    };
  }, [speed]);

  return (
    <div {...rest} ref={host} className={join("relative isolate size-full overflow-hidden bg-sk-hue-deep", className)}>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full [image-rendering:pixelated]" />
      {grain && <Grain />}
      <div className="relative z-10 grid size-full place-items-center p-8 text-center font-sk-display text-3xl font-semibold text-balance text-white">
        {children}
      </div>
    </div>
  );
}
