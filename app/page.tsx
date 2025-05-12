"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ChevronRight, Shield, Wallet, Coins, TrendingUp, Sparkles, BadgeDollarSign, Check } from "lucide-react"
import { ConnectAndSIWE } from "@/components/connect-and-siwe"
import { motion } from "framer-motion"
import Link from "next/link"
import LandingHeader from "@/components/landing-header"

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      <div className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="relative py-32 overflow-hidden bg-gradient-to-b from-background via-background/95 to-background/90">
          <div className="absolute inset-0 bg-grid-white/10 bg-grid-pattern" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h1 
                className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                RiiFi – Riimagin Finance
              </motion.h1>
              <motion.p 
                className="mt-8 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Save in stablecoins. No banks. No barriers.
              </motion.p>
              <motion.p 
                className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                RiiFi is reimagining how everyday people across Africa and beyond save money.
                We provide simple, secure, and flexible saving tools — no bank accounts, no KYC, and no financial jargon. Just you, your wallet, and your goals.
              </motion.p>
              <motion.div 
                className="mt-12 flex flex-col sm:flex-row justify-center gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex justify-center">
                  <ConnectAndSIWE />
                </div>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View Dashboard
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 scroll-mt-16 bg-gradient-to-b from-background via-background/95 to-background/90">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary mb-6"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Features</span>
              </motion.div>
              <motion.h2 
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                What Makes RiiFi Different
              </motion.h2>
              <motion.p 
                className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Experience true financial freedom with our innovative platform built for Africa
              </motion.p>
            </div>

            <div className="grid gap-12">
              {/* Main Feature */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="overflow-hidden border-0">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-8 flex flex-col justify-center">
                      <div className="rounded-full bg-primary/10 p-3 w-fit mb-6">
                        <Coins className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Save in USDC</h3>
                      <p className="text-muted-foreground mb-6">
                        Protect your money from inflation with a stable, transparent digital dollar. Experience the security and stability of USDC stablecoin for your savings.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">Stable Value</span>
                        <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">USD-Backed</span>
                        <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">Inflation Protection</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-primary/10 p-8 flex items-center justify-center">
                      <div className="relative w-full aspect-square max-w-sm">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-primary/20 rounded-full animate-pulse" />
                        <div className="absolute inset-4 bg-gradient-to-br from-primary/30 via-purple-500/30 to-primary/30 rounded-full animate-pulse animation-delay-500" />
                        <div className="absolute inset-8 bg-gradient-to-br from-primary/40 via-purple-500/40 to-primary/40 rounded-full animate-pulse animation-delay-1000" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Coins className="h-20 w-20 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Secondary Features Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    title: "No KYC or Bank Account",
                    description: "All you need is a Coinbase Smart Wallet to get started — no paperwork required.",
                    icon: Wallet,
                    gradient: "from-green-500/10 via-green-400/10 to-green-300/10",
                    tags: ["Easy Setup", "No Paperwork", "Instant Access"]
                  },
                  {
                    title: "Flexible Saving Plans",
                    description: "Choose how you save: time-based, goal-based, or fully flexible.",
                    icon: TrendingUp,
                    gradient: "from-blue-500/10 via-blue-400/10 to-blue-300/10",
                    tags: ["Time-based", "Goal-based", "Flexible"]
                  },
                  {
                    title: "Non-Custodial & Transparent",
                    description: "You stay in full control of your funds at all times.",
                    icon: Shield,
                    gradient: "from-yellow-500/10 via-yellow-400/10 to-yellow-300/10",
                    tags: ["Self-Custody", "Full Control", "Transparent"]
                  },
                  {
                    title: "Built for the Unbanked",
                    description: "Designed with real-world users in mind — especially for those excluded by traditional finance systems.",
                    icon: Sparkles,
                    gradient: "from-purple-500/10 via-purple-400/10 to-purple-300/10",
                    tags: ["Inclusive", "Accessible", "User-Friendly"]
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-white/50 backdrop-blur-sm border-0 relative overflow-hidden group">
                      <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${feature.gradient}`} />
                      <CardHeader className="relative z-10">
                        <div className="rounded-full bg-primary/10 p-3 w-fit mb-6">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl font-semibold mb-3">{feature.title}</CardTitle>
                        <CardDescription className="text-base mb-4">{feature.description}</CardDescription>
                        <div className="flex flex-wrap gap-2">
                          {feature.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-24 bg-gradient-to-b from-background/50 via-background/95 to-background/80 scroll-mt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <motion.h2 
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                How It Works
              </motion.h2>
              <motion.p 
                className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Start your savings journey in three simple steps
              </motion.p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 relative">
              {[
                {
                  step: "01",
                  title: "Connect Wallet",
                  description: "Connect your Coinbase Smart Wallet to get started",
                  gradient: "from-blue-500/10 via-blue-400/10 to-blue-300/10",
                  icon: Wallet
                },
                {
                  step: "02",
                  title: "Choose Your Plan",
                  description: "Choose a saving plan that fits your lifestyle",
                  gradient: "from-purple-500/10 via-purple-400/10 to-purple-300/10",
                  icon: Sparkles
                },
                {
                  step: "03",
                  title: "Start Saving",
                  description: "Start saving in USDC instantly and securely",
                  gradient: "from-green-500/10 via-green-400/10 to-green-300/10",
                  icon: Coins
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <Card className="h-full bg-white/50 backdrop-blur-sm border-0 relative overflow-hidden group">
                    <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${item.gradient}`} />
                    <CardHeader className="relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-5xl font-bold text-primary/20">{item.step}</span>
                        <div className="rounded-full bg-primary/10 p-3">
                          <item.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-semibold mb-2">{item.title}</CardTitle>
                      <CardDescription className="text-base">{item.description}</CardDescription>
                    </CardHeader>
                  </Card>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                        viewport={{ once: true }}
                      >
                        <ChevronRight className="h-8 w-8 text-primary/40" />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 scroll-mt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Benefits of Choosing RiiFI</h2>
                <div className="space-y-4">
                  {[
                    "Save in stable digital dollars (USDC)",
                    "No bank account or KYC required",
                    "Full control of your funds at all times",
                    "Simple and transparent saving plans",
                    "Built for the unbanked and underserved",
                    "Accessible across Africa and beyond"
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="rounded-full bg-primary/10 p-1">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-lg">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-primary/20 p-1">
                  <div className="w-full h-full rounded-xl bg-card p-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <BadgeDollarSign className="h-12 w-12 text-primary" />
                        <div>
                          <div className="text-2xl font-bold">Secure Savings</div>
                          <div className="text-muted-foreground">Your Money, Your Control</div>
                        </div>
                      </div>
                      <div className="h-48 bg-primary/10 rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-primary/10 rounded w-3/4"></div>
                        <div className="h-4 bg-primary/10 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="py-24 bg-gradient-to-b from-background/50 via-background/95 to-background/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary mb-6"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Coming Soon</span>
              </motion.div>
              <motion.h2 
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                More Features Coming Your Way
              </motion.h2>
              <motion.p 
                className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                We're building more tools to enhance your saving experience
              </motion.p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Group Savings",
                  description: "Save together with your friends, family, or community circles.",
                  icon: Sparkles,
                  gradient: "from-purple-500/10 via-purple-400/10 to-purple-300/10",
                  badge: "Community"
                },
                {
                  title: "Spend Anywhere with USDC",
                  description: "Use your savings directly to pay online or offline.",
                  icon: Wallet,
                  gradient: "from-blue-500/10 via-blue-400/10 to-blue-300/10",
                  badge: "Payments"
                },
                {
                  title: "Expense Tracker",
                  description: "See where your money goes and manage your spending with ease.",
                  icon: TrendingUp,
                  gradient: "from-green-500/10 via-green-400/10 to-green-300/10",
                  badge: "Analytics"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-white/50 backdrop-blur-sm border-0 relative overflow-hidden group">
                    <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${feature.gradient}`} />
                    <CardHeader className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="rounded-full bg-primary/10 p-3">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                          {feature.badge}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-semibold mb-2">{feature.title}</CardTitle>
                      <CardDescription className="text-base">{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-gradient-to-b from-background via-primary/5 to-primary/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold">RiiFi is more than a savings app — it's financial freedom without permission.</h2>
              <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
                Join the movement and riimagine your future.
              </p>
              <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
                <div className="flex justify-center">
                  <ConnectAndSIWE />
                </div>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Explore Platform
                    <ArrowUpRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}
