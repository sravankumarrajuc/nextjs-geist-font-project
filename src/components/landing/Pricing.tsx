import Link from 'next/link';

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "per month",
      description: "Perfect for small businesses getting started with review management",
      features: [
        "Up to 3 review platforms",
        "500 AI-generated responses/month",
        "Basic sentiment analysis",
        "Email notifications",
        "1 location",
        "2 team members",
        "Standard support"
      ],
      popular: false,
      cta: "Start Free Trial"
    },
    {
      name: "Professional",
      price: "$79",
      period: "per month",
      description: "Ideal for growing businesses with multiple locations",
      features: [
        "All review platforms",
        "2,000 AI-generated responses/month",
        "Advanced sentiment analysis",
        "Real-time alerts",
        "Up to 5 locations",
        "10 team members",
        "Priority support",
        "Custom response templates",
        "Analytics dashboard"
      ],
      popular: true,
      cta: "Start Free Trial"
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "per month",
      description: "For large organizations with complex review management needs",
      features: [
        "Unlimited platforms",
        "Unlimited AI responses",
        "Advanced analytics & reporting",
        "Custom integrations",
        "Unlimited locations",
        "Unlimited team members",
        "Dedicated account manager",
        "White-label options",
        "API access",
        "Custom workflows"
      ],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {' '}Pricing
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Choose the perfect plan for your business. Start with a 14-day free trial, 
            no credit card required.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-blue-500 scale-105' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{plan.description}</p>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                        ✓
                      </span>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="text-center">
                  {plan.cta === "Contact Sales" ? (
                    <button className="w-full py-3 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300">
                      {plan.cta}
                    </button>
                  ) : (
                    <Link href="/signup">
                      <button className={`w-full py-3 px-6 font-semibold rounded-lg transition-all duration-300 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}>
                        {plan.cta}
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              All Plans Include 14-Day Free Trial
            </h3>
            <p className="text-gray-600 mb-8">
              No credit card required. Cancel anytime. Upgrade or downgrade as your business grows.
            </p>
            
            {/* FAQ Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What happens after the trial?</h4>
                <p className="text-gray-600 text-sm">
                  You can choose to upgrade to a paid plan or continue with limited free features. 
                  No automatic charges.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Can I change plans later?</h4>
                <p className="text-gray-600 text-sm">
                  Yes, you can upgrade or downgrade your plan at any time. 
                  Changes take effect immediately.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Do you offer custom plans?</h4>
                <p className="text-gray-600 text-sm">
                  Yes, we offer custom Enterprise plans for large organizations 
                  with specific requirements.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
                <p className="text-gray-600 text-sm">
                  We accept all major credit cards and offer annual billing 
                  with a 20% discount.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
