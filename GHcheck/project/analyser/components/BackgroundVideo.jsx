export default function BackgroundVideo() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="https://videos.pexels.com/video-files/30767358/13160994_2560_1440_30fps.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/30"></div>
    </div>
  )
}
