import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { makeRect } from "@remotion/shapes";

export const SplitterEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const loopedFrame = frame % 120;

  const beamWidth = interpolate(
    loopedFrame,
    [0, 20, 60, 80],
    [10, 15, 15, 10],
    {
      extrapolateRight: "clamp"
    }
  );

  const opacity = interpolate(
    loopedFrame,
    [0, 15, 45, 60],
    [0.4, 0.8, 0.8, 0.4],
    {
      extrapolateRight: "clamp"
    }
  );

  const path = makeRect({
    width: beamWidth,
    height: height,
    cornerRadius: 0,
    edgeRoundness: 0.5
  }).path;

  const pathOffset = interpolate(
    loopedFrame,
    [0, 30, 60, 90],
    [0, 50, -30, 0],
    { extrapolateRight: "clamp" }
  );

  const rotation = interpolate(
    loopedFrame,
    [0, 30, 60, 90, 120],
    [20, 20, 20, 20, 20],
    {
      extrapolateRight: "clamp",
      easing: (t) => Math.sin(t * Math.PI)
    }
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{
        position: 'absolute',
        filter: 'drop-shadow(0 0 30px rgba(0,255,255,0.8))',
      }}
    >
      <path
        d={path}
        transform={`translate(${width/2 - beamWidth/2} 0) translate(${pathOffset} 0) rotate(${rotation} ${beamWidth/2} ${height/2})`}
        fill="rgba(0,255,255,0.3)"
        opacity={opacity * 0.5}
        style={{
          filter: 'blur(15px)',
        }}
      />
      
      <path
        d={path}
        transform={`translate(${width/2 - beamWidth/2} 0) translate(${pathOffset} 0) rotate(${rotation} ${beamWidth/2} ${height/2})`}
        fill="rgba(0,255,255,0.6)"
        opacity={opacity * 0.7}
        style={{
          filter: 'blur(8px)',
        }}
      />
      
      <path
        d={path}
        transform={`translate(${width/2 - beamWidth/2} 0) translate(${pathOffset} 0) rotate(${rotation} ${beamWidth/2} ${height/2})`}
        fill="#ffffff"
        opacity={opacity}
        style={{
          filter: 'blur(2px)',
        }}
      />
    </svg>
  );
}; 