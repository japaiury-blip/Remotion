import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const GREEN = "#22C55E";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

/** Each word owns its local frame clock, so scrubbing and parallel renders agree. */
const KineticText = ({
  children,
  delay = 0,
  size = 132,
  accent = false,
  impact = false,
}: {
  children: ReactNode;
  delay?: number;
  size?: number;
  accent?: boolean;
  impact?: boolean;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;
  const reveal = spring({
    frame: Math.max(0, local),
    fps,
    config: {
      damping: impact ? 15 : 24,
      stiffness: impact ? 190 : 110,
      mass: 0.85,
    },
  });
  return (
    <div style={{ perspective: 1200 }}>
      <Interactive.Div
        name="Texto cinético"
        style={{
          fontSize: size,
          fontWeight: 900,
          lineHeight: 1.04,
          letterSpacing: -5,
          whiteSpace: "nowrap",
          color: accent ? GREEN : "#FAFAFA",
          opacity: interpolate(local, [0, 7], [0, 1], clamp),
          translate: `0px ${(1 - reveal) * (impact ? 160 : 90)}px`,
          scale: impact ? 1.24 - reveal * 0.24 : 0.86 + reveal * 0.14,
          rotate: `x ${(1 - reveal) * -24}deg`,
          filter: `blur(${interpolate(local, [0, 16], [18, 0], clamp)}px)`,
          textShadow: accent ? "0 0 65px #22c55e55" : "0 4px 32px #0008",
        }}
      >
        {children}
      </Interactive.Div>
    </div>
  );
};

/** Shared scene envelope: holds legibility, then pulls into the next cut. */
const Scene = ({
  children,
  duration,
  label,
  number,
}: {
  children: ReactNode;
  duration: number;
  label: string;
  number: string;
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        padding: "280px 150px 360px 100px",
        justifyContent: "center",
        opacity: interpolate(
          frame,
          [0, 5, duration - 9, duration - 1],
          [0, 1, 1, 0],
          clamp,
        ),
        translate: `0px ${interpolate(frame, [duration - 10, duration], [0, -65], { ...clamp, easing: Easing.in(Easing.cubic) })}px`,
        scale: interpolate(frame, [0, duration], [1, 1.035], clamp),
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 18,
          alignItems: "center",
          marginBottom: 54,
        }}
      >
        <div style={{ width: 36, height: 3, background: GREEN }} />
        <div style={{ color: "#a2aba7", fontSize: 22, letterSpacing: 5 }}>
          {number} / {label}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

/** Continuous dimensional set ties the edits together; no fetched assets or randomness. */
const EnergyField = () => {
  const frame = useCurrentFrame();
  const surge = [90, 180, 300, 390].reduce(
    (sum, cut) =>
      sum + interpolate(frame, [cut - 8, cut, cut + 19], [0, 1, 0], clamp),
    0,
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at ${66 + Math.sin(frame / 65) * 12}% 60%, #22c55e${Math.round(
            16 + surge * 24,
          )
            .toString(16)
            .padStart(2, "0")} 0%, transparent 54%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -260,
          top: 700,
          width: 1600,
          height: 1400,
          perspective: 1000,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `rotateX(64deg) rotateZ(${-28 + frame * 0.045}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: i * 68,
                borderRadius: "50%",
                border: `${i === 3 ? 3 : 1}px solid ${i === 3 ? "#22c55eaa" : "#93c9a52b"}`,
                boxShadow:
                  i === 3
                    ? "0 0 24px #22c55e55, inset 0 0 24px #22c55e22"
                    : undefined,
                transform: `translateZ(${Math.sin(frame / 48 + i * 0.65) * 50}px)`,
              }}
            />
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          width: 3,
          height: 700,
          left: 790,
          top: 560,
          background:
            "linear-gradient(transparent, #22c55e, #e0ffe9, transparent)",
          boxShadow: "0 0 36px #22c55e88",
          rotate: "32deg",
          opacity: 0.3 + surge * 0.5,
          translate: `${Math.sin(frame / 80) * 70}px 0px`,
        }}
      />
      {Array.from({ length: 28 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 60 + ((i * 173) % 960),
            top:
              (((i * 137 - frame * (0.3 + (i % 4) * 0.2)) % 1920) + 1920) %
              1920,
            width: i % 6 === 0 ? 4 : 2,
            height: i % 6 === 0 ? 4 : 2,
            background: i % 3 === 0 ? GREEN : "#fff",
            opacity: 0.12 + (i % 5) * 0.05,
            borderRadius: "50%",
          }}
        />
      ))}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 45% 43%, transparent 26%, #101214cc 95%)",
        }}
      />
    </AbsoluteFill>
  );
};

const LightCut = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 7 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 460 + i * 140,
            left: 0,
            width: 1250,
            height: i === 3 ? 5 : 1,
            background:
              "linear-gradient(90deg, transparent, #22c55e, #e4ffec, transparent)",
            translate: `${interpolate(frame, [0, 16], [-1500 - i * 35, 1400], { ...clamp, easing: Easing.inOut(Easing.cubic) })}px 0px`,
            rotate: "-18deg",
            boxShadow: "0 0 26px #22c55e",
          }}
        />
      ))}
      <AbsoluteFill
        style={{
          backgroundColor: GREEN,
          opacity: interpolate(frame, [0, 7, 16], [0, 0.11, 0], clamp),
        }}
      />
    </AbsoluteFill>
  );
};

const Opening = () => (
  <Scene duration={90} number="01" label="VISÃO">
    <KineticText size={104}>O</KineticText>
    <KineticText delay={7} size={164}>
      FUTURO
    </KineticText>
  </Scene>
);

const Impact = () => (
  <Scene duration={90} number="02" label="VELOCIDADE">
    <KineticText size={156} impact>
      NÃO
    </KineticText>
    <KineticText delay={5} size={146} accent impact>
      ESPERA.
    </KineticText>
  </Scene>
);

const Planning = () => (
  <Scene duration={120} number="03" label="DECISÃO">
    <KineticText size={94}>ENQUANTO</KineticText>
    <KineticText delay={18} size={128}>
      UNS
    </KineticText>
    <KineticText delay={38} size={96}>
      PLANEJAM…
    </KineticText>
  </Scene>
);

const Building = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={90} number="04" label="AÇÃO">
      <KineticText size={126} impact>
        OUTROS
      </KineticText>
      <div style={{ position: "relative", paddingBottom: 32 }}>
        <KineticText delay={8} size={99} accent impact>
          CONSTROEM.
        </KineticText>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 5,
            width: interpolate(frame, [13, 37], [0, 735], {
              ...clamp,
              easing: ease,
            }),
            backgroundColor: GREEN,
            boxShadow: "0 0 24px #22c55e99",
          }}
        />
      </div>
    </Scene>
  );
};

const Closing = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={60} number="05" label="SEU PRÓXIMO PASSO">
      <KineticText size={119}>COMECE</KineticText>
      <KineticText delay={6} size={156} accent>
        AGORA.
      </KineticText>
      <div
        style={{
          marginTop: 56,
          width: 76,
          height: 76,
          border: "1px solid #22c55e88",
          borderRadius: "50%",
          color: GREEN,
          fontSize: 46,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: interpolate(frame, [12, 25], [0, 1], clamp),
          translate: `${interpolate(frame, [12, 35], [-24, 0], { ...clamp, easing: ease })}px 0px`,
        }}
      >
        ↗
      </div>
    </Scene>
  );
};

const Finish = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#101214",
        opacity: interpolate(frame, [428, 449], [0, 1], clamp),
        pointerEvents: "none",
      }}
    />
  );
};

const shell: CSSProperties = {
  backgroundColor: "#101214",
  color: "white",
  fontFamily: "Arial, Helvetica, sans-serif",
  overflow: "hidden",
};

export const FuturoNaoEspera = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={shell}>
      <EnergyField />
      <Sequence name="01 · O FUTURO" durationInFrames={3 * fps}>
        <Opening />
      </Sequence>
      <Sequence
        name="02 · NÃO ESPERA."
        from={3 * fps}
        durationInFrames={3 * fps}
      >
        <Impact />
      </Sequence>
      <Sequence
        name="03 · ENQUANTO UNS PLANEJAM…"
        from={6 * fps}
        durationInFrames={4 * fps}
      >
        <Planning />
      </Sequence>
      <Sequence
        name="04 · OUTROS CONSTROEM."
        from={10 * fps}
        durationInFrames={3 * fps}
      >
        <Building />
      </Sequence>
      <Sequence
        name="05 · COMECE AGORA."
        from={13 * fps}
        durationInFrames={2 * fps}
      >
        <Closing />
      </Sequence>
      <Sequence name="Luz · impacto" from={3 * fps - 7} durationInFrames={17}>
        <LightCut />
      </Sequence>
      <Sequence
        name="Luz · planejamento"
        from={6 * fps - 7}
        durationInFrames={17}
      >
        <LightCut />
      </Sequence>
      <Sequence
        name="Luz · construção"
        from={10 * fps - 7}
        durationInFrames={17}
      >
        <LightCut />
      </Sequence>
      <Sequence
        name="Luz · encerramento"
        from={13 * fps - 7}
        durationInFrames={17}
      >
        <LightCut />
      </Sequence>
      <Finish />
    </AbsoluteFill>
  );
};
