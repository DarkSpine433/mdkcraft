'use client'

import { ContactForm } from '@/components/ContactForm'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { motion } from 'motion/react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent">
              Skontaktuj się z nami
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Masz projekt do zrealizowania? Chętnie wysłuchamy Twoich pomysłów i pomożemy je
              wcielić w życie.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ContactForm />
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-8"
            >
              <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                <h2 className="text-2xl font-bold mb-6">Informacje kontaktowe</h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a
                        href="mailto:kontakt@mdkcraft.com"
                        className="text-neutral-400 hover:text-primary transition-colors"
                      >
                        kontakt@mdkcraft.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Telefon</h3>
                      <a
                        href="tel:+48123456789"
                        className="text-neutral-400 hover:text-primary transition-colors"
                      >
                        +48 123 456 789
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Adres</h3>
                      <p className="text-neutral-400">
                        ul. Przykładowa 123
                        <br />
                        00-000 Warszawa, Polska
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Godziny pracy</h3>
                      <p className="text-neutral-400">
                        Poniedziałek - Piątek: 9:00 - 18:00
                        <br />
                        Sobota - Niedziela: Zamknięte
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                <h2 className="text-2xl font-bold mb-4">Dlaczego warto z nami pracować?</h2>
                <ul className="space-y-3 text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Doświadczony zespół ekspertów</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Nowoczesne technologie i rozwiązania</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Indywidualne podejście do każdego projektu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Wsparcie i komunikacja na każdym etapie</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Terminowa realizacja projektów</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
