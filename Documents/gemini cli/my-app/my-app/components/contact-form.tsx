"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Contact form submitted:")
    console.log({ name, email, whatsapp, message })

    // Construct WhatsApp message
    const whatsappMessage = `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nWhatsApp: ${whatsapp || 'Not provided'}\nMessage: ${message}`

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage)

    // Open WhatsApp with the message
    window.open(`https://wa.me/27792575301?text=${encodedMessage}`, '_blank')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="whatsapp">WhatsApp Number</Label>
        <Input
          id="whatsapp"
          type="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Send Message</Button>
    </form>
  )
}
