import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { CheckCircle, X, Shield, Zap, Users, Crown, ArrowRight } from "lucide-react"

export default function PricingPage() {
  const plans = [
    {
      name: "Basic Defender",
      price: "₹999",
      period: "/month",
      description: "Essential protection for small teams and individuals",
      popular: false,
      features: [
        { name: "50 URL scans per month", included: true },
        { name: "10 screenshot analyses", included: true },
        { name: "Basic threat detection", included: true },
        { name: "Email alerts", included: true },
        { name: "7-day scan history", included: true },
        { name: "Standard support", included: true },
        { name: "Advanced AI detection", included: false },
        { name: "Real-time monitoring", included: false },
        { name: "API access", included: false },
        { name: "Team collaboration", included: false },
        { name: "Custom AI models", included: false },
        { name: "24/7 priority support", included: false },
      ],
      cta: "Start Basic Plan",
      icon: <Shield className="h-6 w-6" />,
    },
    {
      name: "Pro Guardian",
      price: "₹2,999",
      period: "/month",
      description: "Advanced security for growing businesses",
      popular: true,
      features: [
        { name: "500 URL scans per month", included: true },
        { name: "100 screenshot analyses", included: true },
        { name: "Basic threat detection", included: true },
        { name: "Email alerts", included: true },
        { name: "30-day scan history", included: true },
        { name: "Standard support", included: true },
        { name: "Advanced AI detection", included: true },
        { name: "Real-time monitoring", included: true },
        { name: "API access", included: true },
        { name: "Team collaboration", included: false },
        { name: "Custom AI models", included: false },
        { name: "24/7 priority support", included: false },
      ],
      cta: "Start Pro Plan",
      icon: <Zap className="h-6 w-6" />,
    },
    {
      name: "Enterprise Shield",
      price: "₹9,999",
      period: "/month",
      description: "Complete protection for large organizations",
      popular: false,
      features: [
        { name: "Unlimited URL scans", included: true },
        { name: "Unlimited screenshot analyses", included: true },
        { name: "Basic threat detection", included: true },
        { name: "Email alerts", included: true },
        { name: "90-day scan history", included: true },
        { name: "Standard support", included: true },
        { name: "Advanced AI detection", included: true },
        { name: "Real-time monitoring", included: true },
        { name: "API access", included: true },
        { name: "Team collaboration", included: true },
        { name: "Custom AI models", included: true },
        { name: "24/7 priority support", included: true },
      ],
      cta: "Contact Sales",
      icon: <Crown className="h-6 w-6" />,
    },
  ]

  const faqs = [
    {
      question: "What types of threats can ThreatLensAI detect?",
      answer:
        "Our AI can detect phishing attempts, malware, social engineering attacks, brand impersonation, suspicious URLs, and fake login pages with high accuracy.",
    },
    {
      question: "How accurate is the threat detection?",
      answer:
        "ThreatLensAI maintains a 99.9% threat detection rate with less than 0.1% false positives, powered by advanced machine learning algorithms.",
    },
    {
      question: "Can I upgrade or downgrade my plan anytime?",
      answer:
        "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades apply at your next billing cycle.",
    },
    {
      question: "Is there an API available?",
      answer:
        "Yes, Pro and Enterprise plans include full API access with comprehensive documentation and SDKs for popular programming languages.",
    },
    {
      question: "What kind of support do you provide?",
      answer:
        "Basic plans include email support, Pro plans get priority support, and Enterprise customers receive 24/7 dedicated support with SLA guarantees.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="matrix-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background"></div>

        <div className="relative z-10 pt-24 pb-16">
          {/* Header */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
              Choose Your <span className="text-primary">Protection Level</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Flexible pricing plans designed for businesses of all sizes. Start protecting your digital assets today.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-secondary" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-secondary" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-secondary" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <Card
                  key={index}
                  className={`glass-morphism cyber-border hover:cyber-glow transition-all duration-300 relative ${
                    plan.popular ? "ring-2 ring-primary scale-105" : ""
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 w-12 h-12 rounded-full glass-morphism flex items-center justify-center text-primary">
                      {plan.icon}
                    </div>
                    <CardTitle className="font-orbitron text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="font-orbitron text-4xl font-bold text-primary">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          {feature.included ? (
                            <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className={`text-sm ${feature.included ? "" : "text-muted-foreground"}`}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-primary hover:bg-primary/90 cyber-glow"
                          : "variant-outline cyber-border hover:cyber-glow bg-transparent"
                      } transition-all duration-300`}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Enterprise Features */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
            <Card className="glass-morphism cyber-border">
              <CardHeader className="text-center">
                <CardTitle className="font-orbitron text-2xl">Enterprise Features</CardTitle>
                <CardDescription>Advanced capabilities for large organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      icon: <Users className="h-6 w-6 text-primary" />,
                      title: "Team Management",
                      description: "Role-based access control and user management",
                    },
                    {
                      icon: <Shield className="h-6 w-6 text-secondary" />,
                      title: "Custom AI Models",
                      description: "Tailored threat detection for your industry",
                    },
                    {
                      icon: <Zap className="h-6 w-6 text-primary" />,
                      title: "White-label Solution",
                      description: "Branded interface with your company logo",
                    },
                    {
                      icon: <Crown className="h-6 w-6 text-secondary" />,
                      title: "Dedicated Support",
                      description: "24/7 priority support with SLA guarantees",
                    },
                  ].map((feature, index) => (
                    <div key={index} className="text-center space-y-3">
                      <div className="mx-auto w-12 h-12 rounded-full glass-morphism flex items-center justify-center">
                        {feature.icon}
                      </div>
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-orbitron text-3xl font-bold mb-4">
                Frequently Asked <span className="text-primary">Questions</span>
              </h2>
              <p className="text-muted-foreground">Get answers to common questions about ThreatLensAI</p>
            </div>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="glass-morphism cyber-border">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-center">
            <Card className="glass-morphism cyber-border">
              <CardContent className="p-12">
                <h2 className="font-orbitron text-3xl font-bold mb-4">
                  Ready to <span className="text-primary">Secure</span> Your Digital Assets?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of organizations protecting their digital infrastructure with ThreatLensAI's advanced
                  AI-powered threat detection.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 cyber-glow font-semibold px-8">
                    Start Free Trial
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="cyber-border hover:cyber-glow transition-all duration-300 px-8 bg-transparent"
                  >
                    Contact Sales
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
