export const PulseLoading = () => {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* Main pulse circle */}
      <div className="h-16 w-16 animate-pulse rounded-full border-2 border-cyan-400 bg-cyan-400/30" />

      {/* Outer pulse ring - slow animation */}
      <div className="absolute h-24 w-24 animate-ping rounded-full border border-cyan-400/20" />

      {/* Inner pulse ring - medium animation */}
      <div className="animation-delay-75 absolute h-20 w-20 animate-ping rounded-full border border-cyan-400/40" />

      {/* Center dot */}
      <div className="absolute h-2 w-2 rounded-full bg-cyan-400" />
    </div>
  )
}
