import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MessageCircle, HelpCircle, AlertTriangle, Shield } from "lucide-react"
import { ContactForm } from "@/components/contact-form"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-black font-mono">
              Contact Us
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to help! Reach out to our support team for any questions, concerns, or assistance you may need.
          </p>
        </div>

        {/* Emergency Contact */}
        <Card className="border-red-500/30 bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-5 h-5" />
              Gambling Problem Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-red-400">
                If you're experiencing problems with gambling, don't wait. Help is available 24/7.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center space-y-2">
                  <Phone className="w-6 h-6 text-red-500 mx-auto" />
                  <h3 className="font-semibold text-red-500">Crisis Hotline</h3>
                  <p className="text-2xl font-mono text-red-400">1-800-522-4700</p>
                  <p className="text-xs text-red-400">24/7 Confidential Support</p>
                </div>
                <div className="text-center space-y-2">
                  <Mail className="w-6 h-6 text-red-500 mx-auto" />
                  <h3 className="font-semibold text-red-500">Email Support</h3>
                  <p className="text-sm text-red-400">help@punterhq.com</p>
                  <p className="text-xs text-red-400">Response within 24 hours</p>
                </div>
                <div className="text-center space-y-2">
                  <MessageCircle className="w-6 h-6 text-red-500 mx-auto" />
                  <h3 className="font-semibold text-red-500">Live Chat</h3>
                  <p className="text-sm text-red-400">Available on website</p>
                  <p className="text-xs text-red-400">Mon-Fri 9AM-9PM EST</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                General Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-sm text-muted-foreground">support@punterhq.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-sm text-muted-foreground">1-800-SUPPORT-HQ</p>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>Available for:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Account assistance</li>
                  <li>Technical issues</li>
                  <li>Billing questions</li>
                  <li>Feature requests</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                Legal & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="font-semibold">Privacy Concerns</p>
                    <p className="text-sm text-muted-foreground">privacy@punterhq.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="font-semibold">Legal Matters</p>
                    <p className="text-sm text-muted-foreground">legal@punterhq.com</p>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>Available for:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Privacy policy questions</li>
                  <li>Terms of service concerns</li>
                  <li>Regulatory compliance</li>
                  <li>Data protection requests</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Send Us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>

        {/* Response Times */}
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              Response Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center space-y-2">
                <Badge variant="outline" className="text-green-500 border-green-500">
                  Urgent Matters
                </Badge>
                <p className="text-sm text-muted-foreground">1-2 hours</p>
                <p className="text-xs text-muted-foreground">Gambling concerns, security issues</p>
              </div>
              <div className="text-center space-y-2">
                <Badge variant="outline" className="text-blue-500 border-blue-500">
                  Priority Support
                </Badge>
                <p className="text-sm text-muted-foreground">4-6 hours</p>
                <p className="text-xs text-muted-foreground">Account issues, technical problems</p>
              </div>
              <div className="text-center space-y-2">
                <Badge variant="outline" className="text-primary border-primary">
                  General Inquiries
                </Badge>
                <p className="text-sm text-muted-foreground">24-48 hours</p>
                <p className="text-xs text-muted-foreground">Feature requests, feedback</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-500" />
              Additional Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-orange-500">Self-Help Resources</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <Link href="/responsible-gambling" className="text-primary hover:underline">Responsible Gambling Guide</Link></li>
                  <li>• <Link href="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link></li>
                  <li>• <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link></li>
                  <li>• <Link href="/faq" className="text-primary hover:underline">Frequently Asked Questions</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-orange-500">External Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Gamblers Anonymous</li>
                  <li>• National Council on Problem Gambling</li>
                  <li>• GamCare</li>
                  <li>• Gambling Therapy</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Office Hours */}
        <div className="text-center py-6 border-t border-border/50">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Support Hours:</strong> Monday - Friday, 9:00 AM - 9:00 PM EST
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Emergency Support:</strong> Available 24/7 for gambling-related concerns
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              We're committed to providing you with the support you need, when you need it most.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}