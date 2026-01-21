import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, Database, User, Lock, Globe } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-black font-mono">
              Privacy Policy
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString()} | Your privacy is our priority. Learn how we collect, use, and protect your data.
          </p>
        </div>

        {/* Privacy Commitment */}
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Our Privacy Commitment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              At Punter HQ, we are committed to protecting your personal information and respecting your privacy. 
              This policy outlines how we collect, use, store, and protect your data when you use our platform.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Lock, title: "Secure Storage", desc: "256-bit encryption for all data" },
                { icon: Eye, title: "Transparency", desc: "Clear disclosure of data practices" },
                { icon: User, title: "Your Control", desc: "Manage your data preferences" }
              ].map((commitment, index) => (
                <div key={index} className="text-center space-y-2">
                  <commitment.icon className="w-8 h-8 text-primary mx-auto" />
                  <h3 className="font-semibold">{commitment.title}</h3>
                  <p className="text-sm text-muted-foreground">{commitment.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-500" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-blue-500 mb-3">Personal Information</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Name & Email Address</strong>
                      <p>For account creation and communication</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Date of Birth</strong>
                      <p>For age verification purposes only</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Payment Information</strong>
                      <p>Processed securely via third-party providers</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-purple-500 mb-3">Technical Information</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>IP Address & Location</strong>
                      <p>For security and legal compliance</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Browser & Device Data</strong>
                      <p>For optimal service delivery</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Usage Patterns</strong>
                      <p>To improve our services and features</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-500" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Service Delivery",
                  desc: "Provide and maintain our platform features",
                  badge: "Essential"
                },
                {
                  title: "Account Management",
                  desc: "Create and manage your user account",
                  badge: "Essential"
                },
                {
                  title: "Communication",
                  desc: "Send important updates and support responses",
                  badge: "Required"
                },
                {
                  title: "Personalization",
                  desc: "Customize content and recommendations",
                  badge: "Optional"
                },
                {
                  title: "Analytics",
                  desc: "Improve our services and user experience",
                  badge: "Optional"
                },
                {
                  title: "Legal Compliance",
                  desc: "Meet regulatory and legal requirements",
                  badge: "Required"
                }
              ].map((usage, index) => (
                <div key={index} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{usage.title}</h4>
                    <Badge variant={usage.badge === "Essential" ? "default" : "secondary"} className="text-xs">
                      {usage.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{usage.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing & Third Parties */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-orange-500" />
              Data Sharing & Third Parties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We only share your information under specific circumstances and always with your protection in mind.
            </p>
            
            <div className="space-y-3">
              <div className="bg-green-950/20 border border-green-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-green-500 mb-2">When We Share Data:</h4>
                <ul className="text-sm text-green-400 space-y-1">
                  <li>• With your explicit consent</li>
                  <li>• For legal compliance and law enforcement requests</li>
                  <li>• With trusted service providers (payment processors, analytics)</li>
                  <li>• To protect our rights, property, or safety</li>
                </ul>
              </div>
              
              <div className="bg-blue-950/20 border border-blue-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-500 mb-2">Third-Party Services:</h4>
                <div className="text-sm text-blue-400 space-y-1">
                  <p><strong>Payment Processors:</strong> Stripe, PayPal - Secure payment processing</p>
                  <p><strong>Analytics:</strong> Google Analytics - Anonymous usage statistics</p>
                  <p><strong>Cloud Hosting:</strong> AWS, Vercel - Secure data storage</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-purple-500" />
              Your Data Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Access",
                  desc: "Request a copy of your personal data",
                  icon: "👁️"
                },
                {
                  title: "Correction",
                  desc: "Update or correct inaccurate information",
                  icon: "✏️"
                },
                {
                  title: "Deletion",
                  desc: "Request removal of your personal data",
                  icon: "🗑️"
                },
                {
                  title: "Portability",
                  desc: "Transfer your data to another service",
                  icon: "📤"
                }
              ].map((right, index) => (
                <div key={index} className="text-center space-y-2 p-3 border rounded-lg">
                  <div className="text-2xl">{right.icon}</div>
                  <h3 className="font-semibold">{right.title}</h3>
                  <p className="text-sm text-muted-foreground">{right.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                To exercise these rights, contact our privacy team:
              </p>
              <Badge variant="outline" className="text-purple-500 border-purple-500">
                privacy@punterhq.com
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-500">
              <Lock className="w-5 h-5" />
              Data Security Measures
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Technical Protection:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 256-bit SSL/TLS encryption</li>
                  <li>• Secure socket layer (SSL) technology</li>
                  <li>• Regular security audits and updates</li>
                  <li>• Firewall and intrusion detection</li>
                  <li>• Secure data centers with 24/7 monitoring</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Organizational Protection:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Employee background checks</li>
                  <li>• Strict access controls</li>
                  <li>• Privacy training for all staff</li>
                  <li>• Data protection policies</li>
                  <li>• Incident response procedures</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookies & Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              Cookies & Tracking Technologies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We use cookies and similar technologies to enhance your experience and improve our services.
            </p>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2">Essential Cookies:</h4>
                <p className="text-sm text-muted-foreground">
                  Required for basic site functionality, security, and authentication. Cannot be disabled.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Performance Cookies:</h4>
                <p className="text-sm text-muted-foreground">
                  Help us understand how our site is used and improve performance.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Marketing Cookies:</h4>
                <p className="text-sm text-muted-foreground">
                  Used to personalize content and advertisements (optional).
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <Badge variant="outline" className="text-blue-500 border-blue-500">
                You can manage cookie preferences in your browser settings
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Policy Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-gray-500" />
              Policy Updates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time to reflect changes in our practices or legal requirements.
            </p>
            <div className="bg-gray-950/20 border border-gray-500/30 rounded-lg p-4">
              <h4 className="font-semibold mb-2">How We Notify You:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Email notification for significant changes</li>
                <li>• In-app notifications for logged-in users</li>
                <li>• Website banner for all visitors</li>
                <li>• Updated "Last Modified" date at the top</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Privacy Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                If you have questions about this privacy policy or your data rights, please contact our privacy team:
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Badge variant="outline" className="text-primary border-primary">
                  Email: privacy@punterhq.com
                </Badge>
                <Badge variant="outline" className="text-primary border-primary">
                  Phone: 1-800-PRIVACY-HQ
                </Badge>
              </div>
              <div className="space-y-2">
                <Link href="/contact" className="text-primary hover:underline">
                  Contact Support →
                </Link>
                <span className="mx-2 text-muted-foreground">|</span>
                <Link href="/terms-of-service" className="text-primary hover:underline">
                  Terms of Service →
                </Link>
                <span className="mx-2 text-muted-foreground">|</span>
                <Link href="/responsible-gambling" className="text-primary hover:underline">
                  Responsible Gambling →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final Statement */}
        <div className="text-center py-6 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            By using Punter HQ, you acknowledge that you have read and understood this Privacy Policy 
            and consent to the collection, use, and sharing of your information as described herein.
          </p>
        </div>
      </div>
    </div>
  )
}