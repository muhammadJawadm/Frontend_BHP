import { Shield, Users, Heart, CheckCircle } from "lucide-react"

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="bg-primary/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Shield className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 text-balance">Terms of Service</h1>
          <p className="text-xl text-muted-foreground mb-2 text-pretty">Empowering Women, One Purchase at a Time</p>
          <p className="text-sm text-muted-foreground">Last Updated: 12/09/2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-card border border-border rounded-lg p-8 mb-12 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent/10 rounded-full flex-shrink-0">
              <Heart className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-card-foreground mb-3">Welcome to Buy Her Power</h2>
              <p className="text-muted-foreground leading-relaxed">
                Buy Her Power (BHP) is a marketplace that empowers women to sell handmade, traditional, and locally
                crafted products. By accessing or using our platform, you agree to comply with these terms and all
                applicable laws. We're committed to creating a safe, supportive environment for women entrepreneurs.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-card border border-border rounded-lg p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold text-card-foreground">1. Eligibility</h2>
            </div>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>You must be 13 years or older to register as a seller or buyer.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Sellers must provide accurate personal and store information.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  We may suspend or terminate accounts that provide false, incomplete, or misleading information.
                </span>
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-card-foreground mb-6">2. Accounts & Responsibilities</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Sellers
                </h3>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>You are responsible for the accuracy, quality, and legality of the products you list.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>
                      You must ensure your products comply with local laws, cultural values, and our platform rules.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>You are responsible for fulfilling orders in a timely and professional manner.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  Buyers
                </h3>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>You are responsible for providing correct delivery details.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>You must make payments through the approved methods on the platform.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-card border border-border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-card-foreground mb-6">3. Prohibited Items</h2>
            <p className="text-muted-foreground mb-4">The following products are not allowed on BHP:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <span>Counterfeit, stolen, or illegal items</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <span>Weapons, drugs, alcohol, or hazardous materials</span>
                </li>
              </ul>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <span>Items that violate intellectual property rights</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <span>Content or products considered offensive or harmful</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="bg-card border border-border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-card-foreground mb-6">4. Payments & Fees</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  Payments between buyers and sellers are processed through secure third-party payment gateways.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Sellers may be subject to service fees, which will be communicated clearly on the platform.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>BHP is not responsible for delays caused by banks, payment providers, or shipping services.</span>
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-card-foreground mb-6">5. Shipping & Delivery</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Sellers are responsible for safe and timely shipping of products.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Buyers are encouraged to review shipping timelines before placing orders.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  BHP is not liable for delays, damages, or losses caused during delivery, but we will support dispute
                  resolution when possible.
                </span>
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-card-foreground mb-6">6. Cancellations & Refunds</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Sellers must clearly state their return/refund policies in product listings.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Buyers must review policies before purchase.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  In case of disputes, BHP may mediate but is not responsible for financial compensation unless required
                  by law.
                </span>
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-card-foreground mb-6">7. Intellectual Property</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Sellers retain ownership of their product designs, photos, and descriptions.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  By uploading content, sellers grant BHP a license to display, promote, and market their products on
                  the platform.
                </span>
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-card-foreground mb-6">8. Termination</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent
                  activity, or harm the community.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Users may request account deletion by contacting support.</span>
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-card-foreground mb-6">9. Limitation of Liability</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>BHP provides the platform "as is" without guarantees of uninterrupted service.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  We are not liable for direct or indirect losses caused by misuse, technical issues, or third-party
                  actions.
                </span>
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-card-foreground mb-6">10. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We may update these Terms of Service at any time. Continued use of the platform after updates means you
              agree to the revised terms.
            </p>
          </section>
        </div>

        <div className="mt-12 bg-gradient-to-r from-primary/5 to-accent/5 border border-border rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-card-foreground mb-4">Questions About Our Terms?</h2>
          <p className="text-muted-foreground mb-6">
            We're here to help! If you have any questions or concerns about these Terms of Service, don't hesitate to
            reach out.
          </p>
          <a
            href="mailto:Info@buyherpower.com"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService
