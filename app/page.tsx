import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Scan, Eye, Activity, AlertTriangle, Zap, Users, Award, CheckCircle } from "lucide-react"
import { LandingNavigation } from "@/components/landing-navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <LandingNavigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center matrix-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-orbitron text-4xl md:text-6xl lg:text-7xl font-bold">
                <span className="text-primary">Protect</span> Your Digital Assets
              </h1>
              <h2 className="font-orbitron text-2xl md:text-3xl lg:text-4xl font-semibold text-secondary">
                with AI-Powered Threat Detection
              </h2>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Advanced phishing detection, real-time monitoring, and intelligent threat analysis to keep your
              organization safe from cyber attacks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground cyber-glow font-semibold px-8 py-3"
              >
                <Scan className="mr-2 h-5 w-5" />
                Start Free Scan
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="cyber-border hover:cyber-glow transition-all duration-300 px-8 py-3 bg-transparent"
              >
                Watch Demo
              </Button>
            </div>

            {/* Floating Security Badges */}
            <div className="flex justify-center items-center space-x-8 mt-12">
              <div className="glass-morphism rounded-full p-3 cyber-glow">
                <Shield className="h-6 w-6 text-secondary" />
              </div>
              <div className="glass-morphism rounded-full p-3 cyber-glow">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <div className="glass-morphism rounded-full p-3 cyber-glow">
                <Zap className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">
              Advanced <span className="text-primary">Threat Detection</span> Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive cybersecurity tools powered by cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Scan className="h-8 w-8 text-primary" />,
                title: "URL Analysis",
                description: "Deep scanning of URLs to detect phishing attempts, malware, and suspicious redirects",
              },
              {
                icon: <Eye className="h-8 w-8 text-secondary" />,
                title: "Screenshot Intelligence",
                description: "AI-powered visual analysis to identify fake login pages and social engineering attempts",
              },
              {
                icon: <Activity className="h-8 w-8 text-primary" />,
                title: "Real-time Monitoring",
                description: "Continuous surveillance of your digital assets with instant threat notifications",
              },
              {
                icon: <AlertTriangle className="h-8 w-8 text-destructive" />,
                title: "Threat Classification",
                description: "Intelligent categorization of threats with detailed risk assessment and severity levels",
              },
              {
                icon: <Shield className="h-8 w-8 text-secondary" />,
                title: "Risk Assessment",
                description: "Comprehensive security scoring with actionable recommendations for threat mitigation",
              },
              {
                icon: <Zap className="h-8 w-8 text-primary" />,
                title: "API Integration",
                description: "Seamless integration with your existing security infrastructure via robust APIs",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="glass-morphism cyber-border hover:cyber-glow transition-all duration-300 group"
              >
                <CardHeader>
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <CardTitle className="font-orbitron text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">
              Choose Your <span className="text-primary">Protection Level</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Flexible pricing plans designed for businesses of all sizes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Basic Defender",
                price: "₹999",
                period: "/month",
                description: "Essential protection for small teams",
                features: [
                  "50 URL scans",
                  "10 screenshot analyses",
                  "Basic threat detection",
                  "Email alerts",
                  "7-day history",
                ],
                popular: false,
              },
              {
                name: "Pro Guardian",
                price: "₹2,999",
                period: "/month",
                description: "Advanced security for growing businesses",
                features: [
                  "500 URL scans",
                  "100 screenshots",
                  "Advanced AI detection",
                  "Real-time monitoring",
                  "30-day history",
                  "API access",
                ],
                popular: true,
              },
              {
                name: "Enterprise Shield",
                price: "₹9,999",
                period: "/month",
                description: "Complete protection for large organizations",
                features: [
                  "Unlimited scans",
                  "Custom AI models",
                  "Team collaboration",
                  "90-day history",
                  "24/7 support",
                  "White-label",
                ],
                popular: false,
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`glass-morphism cyber-border hover:cyber-glow transition-all duration-300 relative ${plan.popular ? "ring-2 ring-primary" : ""}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="font-orbitron text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="font-orbitron text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90 cyber-glow" : "variant-outline cyber-border hover:cyber-glow"} transition-all duration-300`}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">
              Trusted by <span className="text-primary">Security Professionals</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of organizations protecting their digital assets with ThreatLensAI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="glass-morphism cyber-border text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-orbitron font-bold text-primary mb-2">99.9%</div>
                <div className="text-sm text-muted-foreground">Threat Detection Rate</div>
              </CardContent>
            </Card>
            <Card className="glass-morphism cyber-border text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-orbitron font-bold text-secondary mb-2 threat-pulse">1,247,892</div>
                <div className="text-sm text-muted-foreground">Threats Blocked Today</div>
              </CardContent>
            </Card>
            <Card className="glass-morphism cyber-border text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-orbitron font-bold text-primary mb-2">10,000+</div>
                <div className="text-sm text-muted-foreground">Protected Organizations</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="glass-morphism rounded-lg p-4">
              <Award className="h-8 w-8 text-secondary" />
            </div>
            <div className="glass-morphism rounded-lg p-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div className="glass-morphism rounded-lg p-4">
              <Users className="h-8 w-8 text-destructive" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-orbitron text-lg font-bold text-primary">ThreatLensAI</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 ThreatLensAI. All rights reserved. Protecting digital assets worldwide.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
