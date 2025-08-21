import GHcheck from "../components/GHcheck"
import Social from "../components/social"
export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ filter: "brightness(0.3)" }}
      >
        {/* <source src="https://videos.pexels.com/video-files/3141208/3141208-uhd_2560_1440_25fps.mp4" type="video/mp4" /> */}
        <source src="https://videos.pexels.com/video-files/8762941/8762941-uhd_2560_1440_25fps.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-br from-background/20 via-background/10 to-background/30 z-10"></div>

      <main className="relative z-20 min-h-screen py-8">
        <GHcheck />
      </main>

      <footer className="relative z-20 glass-card border-t border-white/10 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sidebar-foreground font-dm-sans">
            Created by{" "}
            <span className="font-space-grotesk font-semibold text-primary hover:text-secondary transition-colors duration-300 hover:scale-105 inline-block cursor-pointer">
              Ayoub Bouagna
            </span>{" "}
            – Software Engineer
          </p>
        </div>
        <Social />
      </footer>
    </div>
  )
}
