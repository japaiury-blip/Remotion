import { MyComposition } from "./Composition";
import { Composition } from "remotion";
import { FuturoNaoEspera } from "./FuturoNaoEspera";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition
        id="FuturoNaoEspera"
        component={FuturoNaoEspera}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
