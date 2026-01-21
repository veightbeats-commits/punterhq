import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, AlertCircle, Gavel, Shield } from "lucide-react"
import Link from "next/link"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-black font-mono">
              Terms of Service
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString()} | Please read these terms carefully before using our platform.
          </p>
        </div>

        {/* Agreement Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="w-5 h-5 text-primary" />
              Agreement to Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              By accessing and using Punter HQ, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
              If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
            <div className="bg-red-950/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-500 mb-2">
                <AlertCircle className="w-4 h-4" />
                <strong>Important:</strong>
              </div>
              <p className="text-sm text-red-400">
                These terms constitute a legally binding agreement between you and Punter HQ. 
                Please ensure you understand and accept all terms before proceeding.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Eligibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              Eligibility Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">18+</Badge>
                <div>
                  <h4 className="font-semibold">Age Requirement</h4>
                  <p className="text-sm text-muted-foreground">
                    You must be at least 18 years of age to create an account and use our services.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">JURISDICTION</Badge>
                <div>
                  <h4 className="font-semibold">Legal Compliance</h4>
                  <p className="text-sm text-muted-foreground">
                    You must comply with all local, state, national, and international laws applicable to your use of our service.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">CAPACITY</Badge>
                <div>
                  <h4 className="font-semibold">Legal Capacity</h4>
                  <p className="text-sm text-muted-foreground">
                    You must have full legal capacity to enter into binding agreements.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Service Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2">What We Provide:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Betting strategies and analysis tools</li>
                  <li>AI-powered match predictions and insights</li>
                  <li>Educational content about sports betting</li>
                  <li>Statistical data and historical performance metrics</li>
                  <li>Community features and discussion forums</li>
                </ul>
              </div>
              <div className="bg-yellow-950/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <strong>Important Disclaimer:</strong>
                </div>
                <p className="text-sm text-yellow-400">
                  We are <strong>not a betting platform</strong>. We do not facilitate actual betting activities. 
                  Our services are for informational and educational purposes only.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-500" />
              User Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Account Security",
                  desc: "Maintain confidentiality of your login credentials"
                },
                {
                  title: "Responsible Use",
                  desc: "Use our services responsibly and ethically"
                },
                {
                  title: "Information Accuracy",
                  desc: "Provide accurate and complete registration information"
                },
                {
                  title: "Prohibited Activities",
                  desc: "No hacking, scraping, or malicious use of our platform"
                },
                {
                  title: "Content Guidelines",
                  desc: "Post appropriate content respecting community standards"
                },
                {
                  title: "Legal Compliance",
                  desc: "Comply with all applicable betting laws in your jurisdiction"
                }
              ].map((responsibility, index) => (
                <div key={index} className="border-l-2 border-orange-500/30 pl-3">
                  <h4 className="font-semibold text-orange-500">{responsibility.title}</h4>
                  <p className="text-sm text-muted-foreground">{responsibility.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Limitations & Disclaimers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Limitations & Disclaimers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="bg-red-950/20 border border-red-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-red-500 mb-2">No Guarantees</h4>
                <ul className="text-sm text-red-400 space-y-1">
                  <li>• No guarantee of winning or profitable outcomes</li>
                  <li>• Past performance does not predict future results</li>
                  <li>• All betting involves financial risk</li>
                  <li>• You are solely responsible for betting decisions</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Service Availability</h4>
                <p className="text-sm text-muted-foreground">
                  We reserve the right to modify, suspend, or discontinue any aspect of our service at any time without prior notice.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Third-Party Content</h4>
                <p className="text-sm text-muted-foreground">
                  We are not responsible for third-party websites, services, or content that may be linked from our platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-500" />
              Intellectual Property
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              All content, features, and functionality of the Punter HQ platform are owned by Punter HQ and are protected by 
              copyright, trademark, and other intellectual property laws.
            </p>
            <div className="bg-purple-950/20 border border-purple-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-purple-500 mb-2">Usage Rights</h4>
              <p className="text-sm text-purple-400">
                You may use our content for personal, non-commercial purposes only. 
                Unauthorized reproduction, distribution, or commercial use is strictly prohibited.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              Limitation of Liability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-red-400 font-semibold">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, PUNTER HQ SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, 
              GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
            <p className="text-sm text-muted-foreground">
              Our total liability to you for any cause of action whatsoever, and regardless of the form of the action, 
              will at all times be limited to the amount paid, if any, by you to us during the six (6) month period 
              prior to any cause of action arising.
            </p>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="w-5 h-5 text-gray-500" />
              Termination
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We may terminate or suspend your account and bar access to the service immediately, without prior notice or 
              liability, under our sole discretion, for any reason whatsoever and without limitation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Grounds for Termination:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Violation of these terms</li>
                  <li>• Fraudulent or illegal activities</li>
                  <li>• Misuse of the platform</li>
                  <li>• Inactivity for extended periods</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Effect of Termination:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Immediate loss of account access</li>
                  <li>• Forfeiture of any remaining balance</li>
                  <li>• Removal from community features</li>
                  <li>• Prohibition from future access</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Contact & Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                If you have questions about these Terms of Service, please contact our legal team:
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Badge variant="outline" className="text-primary border-primary">
                  Email: legal@punterhq.com
                </Badge>
                <Badge variant="outline" className="text-primary border-primary">
                  Phone: 1-800-LEGAL-HQ
                </Badge>
              </div>
              <div className="space-y-2">
                <Link href="/contact" className="text-primary hover:underline">
                  Contact Support →
                </Link>
                <span className="mx-2 text-muted-foreground">|</span>
                <Link href="/privacy-policy" className="text-primary hover:underline">
                  Privacy Policy →
                </Link>
                <span className="mx-2 text-muted-foreground">|</span>
                <Link href="/responsible-gambling" className="text-primary hover:underline">
                  Responsible Gambling →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final Notice */}
        <div className="text-center py-6 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            By continuing to use Punter HQ, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  )
}