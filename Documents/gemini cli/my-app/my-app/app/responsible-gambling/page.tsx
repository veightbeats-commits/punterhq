import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, Shield, AlertTriangle, Users, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function ResponsibleGamblingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl md:text-5xl font-black font-mono text-red-500">
              Responsible Gambling
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            At Punter HQ, we prioritize your well-being with specific focus on South African gambling regulations and support systems.
          </p>
        </div>

        {/* South African Legal Framework */}
        <Card className="border-green-500/30 bg-green-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-green-500 mb-2">South African Gambling Laws</h3>
                <p className="text-green-400">
                  The <strong>National Gambling Act of 2004</strong> regulates all gambling activities in South Africa. 
                  Only licensed operators may provide gambling services. Users must be <strong>18 years and older</strong>.
                </p>
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-green-400">
                    <strong>Legal Age:</strong> 18+ years strictly enforced
                  </p>
                  <p className="text-sm text-green-400">
                    <strong>Licensed Operators:</strong> All legal betting must be NGB-licensed
                  </p>
                  <p className="text-sm text-green-400">
                    <strong>Problem Gambling Fund:</strong> Mandatory contributions from all licensed operators
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warning Signs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Warning Signs of Problem Gambling
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Betting more money than you can afford to lose",
                "Chasing losses by betting more to win back money",
                "Lying about gambling activities to family/friends",
                "Neglecting work, family, or personal responsibilities",
                "Borrowing money to fund gambling activities (loan sharks)",
                "Feeling restless or irritable when trying to cut down",
                "Using gambling as escape from problems",
                "Secret gambling behavior or hiding activities from loved ones"
              ].map((sign, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-foreground">{sign}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* South African Help Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-green-500" />
              South African Help Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* National Gambling Board */}
            <div className="border-l-2 border-green-500/30 pl-3">
              <h4 className="font-semibold text-green-500">National Gambling Board (NGB)</h4>
              <p className="text-sm text-green-400">0800 633 324</p>
              <p className="text-xs text-muted-foreground">South Africa's official gambling regulator</p>
            </div>

            {/* SA Responsible Gambling Foundation */}
            <div className="border-l-2 border-green-500/30 pl-3">
              <h4 className="font-semibold text-green-500">SARGF Helpline</h4>
              <p className="text-sm text-green-400">0800 006 008</p>
              <p className="text-xs text-muted-foreground">Free counseling and support for problem gambling</p>
            </div>

            {/* Treatment Centers */}
            <div className="border-l-2 border-green-500/30 pl-3">
              <h4 className="font-semibold text-green-500">South African Depression and Anxiety Group (SADAG)</h4>
              <p className="text-sm text-green-400">0800 21 23 23</p>
              <p className="text-xs text-muted-foreground">24/7 counseling for gambling addiction</p>
            </div>

            {/* Emergency Support */}
            <div className="border-l-2 border-red-500/30 pl-3">
              <h4 className="font-semibold text-red-500">LifeLine South Africa</h4>
              <p className="text-sm text-red-400">0861 322 322</p>
              <p className="text-xs text-muted-foreground">24/7 crisis counseling and emotional support</p>
            </div>

            {/* Government Resources */}
            <div className="border-l-2 border-blue-500/30 pl-3">
              <h4 className="font-semibold text-blue-500">Department of Social Development</h4>
              <p className="text-sm text-blue-400">0800 205 456</p>
              <p className="text-xs text-muted-foreground">Government addiction treatment services</p>
            </div>

            {/* SMS Support */}
            <div className="border-l-2 border-purple-500/30 pl-3">
              <h4 className="font-semibold text-purple-500">SMS Support Services</h4>
              <p className="text-sm text-purple-400">31610</p>
              <p className="text-xs text-muted-foreground">SMS "HELP" to 31610 for support</p>
            </div>
          </CardContent>
        </Card>

        {/* Tools & Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Protection Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: "Deposit Limits", desc: "Set daily, weekly, or monthly deposit limits" },
                { title: "Time Limits", desc: "Control how much time you spend on our platform" },
                { title: "Self-Exclusion", desc: "Temporarily or permanently exclude yourself" },
                { title: "Reality Checks", desc: "Receive reminders about your gambling time" }
              ].map((tool, index) => (
                <div key={index} className="border-l-2 border-blue-500/30 pl-3">
                  <h4 className="font-semibold text-blue-500">{tool.title}</h4>
                  <p className="text-sm text-muted-foreground">{tool.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                Support Organizations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="border-l-2 border-orange-500/30 pl-3">
                <h4 className="font-semibold text-orange-500">Gamblers Anonymous South Africa</h4>
                <p className="text-sm text-muted-foreground">0800 006 067</p>
                <p className="text-xs text-muted-foreground">Local meetings throughout South Africa</p>
              </div>
              <div className="border-l-2 border-orange-500/30 pl-3">
                <h4 className="font-semibold text-orange-500">Recovery Direct</h4>
                <p className="text-sm text-muted-foreground">0861 RECOVERY</p>
                <p className="text-xs text-muted-foreground">Referral service for treatment centers</p>
              </div>
              <div className="border-l-2 border-orange-500/30 pl-3">
                <h4 className="font-semibold text-orange-500">Adcock Ingram Gambling</h4>
                <p className="text-sm text-muted-foreground">0800 220 2224</p>
                <p className="text-xs text-muted-foreground">Private gambling addiction treatment</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              What You Can Do
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  step: "1",
                  title: "Self-Assessment",
                  desc: "Take honest inventory of your gambling behavior"
                },
                {
                  step: "2", 
                  title: "Set Limits",
                  desc: "Establish strict betting and time limits"
                },
                {
                  step: "3",
                  title: "Seek Help",
                  desc: "Reach out to South African support organizations"
                }
              ].map((action, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                    {action.step}
                  </div>
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>



        {/* South African Gambling Act Summary */}
        <Card className="border-purple-500/30 bg-purple-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-500">
              <Shield className="w-5 h-5" />
              National Gambling Act 2004 - Key Points
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <p className="text-purple-400 text-sm">
                <strong>Licensed Operations Only:</strong> All gambling must be conducted by NGB-licensed operators
              </p>
              <p className="text-purple-400 text-sm">
                <strong>Problem Gambling Levy:</strong> All licensed operators contribute to national treatment programs
              </p>
              <p className="text-purple-400 text-sm">
                <strong>Advertising Restrictions:</strong> Strict rules on gambling advertising in South Africa
              </p>
              <p className="text-purple-400 text-sm">
                <strong>Player Protection:</strong> Mandatory responsible gambling measures for all operators
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Final Warning */}
        <Card className="border-red-500/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-red-500 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span className="uppercase font-mono">Important Notice</span>
              </div>
              <p className="text-sm text-red-400 max-w-3xl mx-auto">
                <strong>Gambling can be addictive.</strong> Please gamble responsibly. 
                Only bet what you can afford to lose. If you or someone you know has a gambling problem, 
                seek help immediately from the South African resources listed above.
              </p>
              <div className="mt-4 p-3 bg-yellow-950/20 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-xs">
                  <strong>Emergency:</strong> If you're in crisis, call LifeLine South Africa at 0861 322 322
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Links */}
        <div className="text-center py-6 border-t border-border/50">
          <div className="space-y-2">
            <Link href="/privacy-policy" className="text-primary hover:underline underline-offset-2">
              Privacy Policy
            </Link>
            <span className="mx-2 text-muted-foreground">|</span>
            <Link href="/terms-of-service" className="text-primary hover:underline underline-offset-2">
              Terms of Service
            </Link>
            <span className="mx-2 text-muted-foreground">|</span>
            <a 
              href="https://www.ngb.org.za" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline underline-offset-2"
            >
              National Gambling Board →
            </a>
            <span className="mx-2 text-muted-foreground">|</span>
            <a 
              href="https://www.sargf.org.za" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline underline-offset-2"
            >
              SARGF →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}