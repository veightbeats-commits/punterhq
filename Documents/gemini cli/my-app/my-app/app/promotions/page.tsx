"use client"

export default function PromotionsPage() {
  const promotions = [
    {
      name: "BETWAY",
      url: "https://sports.betway.co.za/",
      bgColor: "bg-[#00E000]",
      textColor: "text-black",
    },
    {
      name: "SUPERSPORTBET",
      url: "https://www.supersportbet.com/sportsbook/",
      bgColor: "bg-[#0000FF]",
      textColor: "text-white",
    },
    {
      name: "EASYBET",
      url: "https://easybet.co.za/",
      bgColor: "bg-[#FFD700]",
      textColor: "text-black",
    },
    {
      name: "SUNBETS",
      url: "https://play.sunbet.co.za",
      bgColor: "bg-[#FF0000]",
      textColor: "text-white",
    },
  ]

  const handleClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Bg Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] opacity-20"></div>
      </div>

      <div className="flex-1 flex flex-col p-4 md:p-8 gap-4 md:gap-6 max-w-4xl mx-auto w-full relative z-10">
        <h1 className="text-3xl md:text-5xl font-black text-center mb-8 text-foreground font-mono italic tracking-tighter">
          BETTING <span className="text-primary text-stroke-primary">PROMOTIONS</span>
        </h1>

        <div className="flex flex-col gap-4 md:gap-6">
          {promotions.map((promo) => (
            <button
              key={promo.name}
              onClick={() => handleClick(promo.url)}
              className={`relative group ${promo.bgColor} ${promo.textColor} p-8 md:p-12 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(var(--primary),0.3)] cursor-pointer skewed-edge overflow-hidden border-2 border-transparent hover:border-white/50`}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity skew-x-[-20deg] translate-x-[-100%] group-hover:translate-x-[200%] duration-700 pointer-events-none"></div>
              <h2 className="text-4xl md:text-6xl font-black tracking-wider italic font-mono relative z-10">{promo.name}</h2>
            </button>
          ))}
        </div>

        <p className="text-center text-sm font-mono text-muted-foreground mt-8 border-t border-border/30 pt-4">
          /// SELECT A PARTNER TO INITIALIZE LAUNCH SEQUENCE ///
        </p>
      </div>
    </div>
  )
}
