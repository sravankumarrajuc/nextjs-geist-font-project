export default function Features() {
  const features = [
    {
      title: "Multi-Platform Integration",
      description: "Connect Google, Yelp, Facebook, TripAdvisor, Trustpilot, and Zomato reviews in one unified dashboard.",
      benefits: ["One-click platform connections", "Real-time review syncing", "Historical data import via CSV"]
    },
    {
      title: "AI-Powered Response Generation",
      description: "Generate personalized, professional responses to customer reviews using advanced AI technology.",
      benefits: ["Context-aware responses", "Brand voice consistency", "Multi-language support"]
    },
    {
      title: "Advanced Sentiment Analysis",
      description: "Understand customer emotions and identify trends with sophisticated sentiment analysis and topic extraction.",
      benefits: ["Real-time sentiment scoring", "Topic trend identification", "Entity recognition"]
    },
    {
      title: "Smart Alerts & Notifications",
      description: "Stay informed about negative reviews, sentiment spikes, and SLA risks with intelligent alerting.",
      benefits: ["Negative review alerts", "Sentiment spike detection", "Response time tracking"]
    },
    {
      title: "Comprehensive Analytics",
      description: "Track ratings, sentiment trends, response times, and competitor performance with detailed analytics.",
      benefits: ["Rating trend analysis", "Response time metrics", "Competitor benchmarking"]
    },
    {
      title: "Team Collaboration",
      description: "Manage multiple locations and team members with role-based access control and workflow management.",
      benefits: ["Multi-location support", "Role-based permissions", "Audit trail logging"]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Master
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {' '}Customer Reviews
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Powerful features designed to streamline your review management process 
            and turn customer feedback into business growth opportunities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors duration-300 border border-gray-100"
            >
              {/* Feature Icon */}
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white text-xl font-bold">{index + 1}</span>
              </div>

              {/* Feature Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {feature.description}
              </p>

              {/* Feature Benefits */}
              <ul className="space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Review Management?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of businesses already using Review Pilot AI to improve their online reputation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                Start Free Trial
              </button>
              <button className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
