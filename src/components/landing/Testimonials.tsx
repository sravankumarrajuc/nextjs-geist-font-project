'use client';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "Bella Vista Restaurant Group",
      content: "Review Pilot AI has transformed how we handle customer feedback. The AI-generated responses are so natural and on-brand, and we've seen a 40% improvement in our response time.",
      rating: 5,
      avatar: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e670fdb3-19d3-4856-9e11-c3054da5cb9a.png"
    },
    {
      name: "Michael Chen",
      role: "Operations Manager",
      company: "TechStart Solutions",
      content: "The sentiment analysis feature is incredible. We can now identify issues before they become major problems. Our customer satisfaction scores have improved by 25%.",
      rating: 5,
      avatar: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3bff5b8b-f492-4c10-81ca-bfc0228af8aa.png"
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Success Lead",
      company: "Urban Fitness Centers",
      content: "Managing reviews across 12 locations used to be a nightmare. Now everything is centralized, and our team can respond quickly and consistently. Game changer!",
      rating: 5,
      avatar: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a20203f8-4970-4714-8a49-20496f44915a.png"
    },
    {
      name: "David Thompson",
      role: "Franchise Owner",
      company: "QuickBite Restaurants",
      content: "The analytics dashboard gives us insights we never had before. We've identified key areas for improvement and our overall rating has increased from 3.8 to 4.6 stars.",
      rating: 5,
      avatar: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/dd12b0c6-6fa3-4a22-ae91-13dc9c67876e.png"
    },
    {
      name: "Lisa Park",
      role: "Digital Marketing Manager",
      company: "Luxury Hotels Group",
      content: "The multi-platform integration is seamless. We're now managing reviews from Google, TripAdvisor, and Booking.com all in one place. Saves us hours every week.",
      rating: 5,
      avatar: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/7cc5a407-e030-45e8-9656-08dee707967f.png"
    },
    {
      name: "James Wilson",
      role: "CEO",
      company: "Wilson Automotive",
      content: "Review Pilot AI helped us turn our online reputation around. The AI responses are professional and help us maintain a positive brand image. Highly recommended!",
      rating: 5,
      avatar: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/bdcc5646-b4bc-47cd-b188-10f6109fcd59.png"
    }
  ];

  const stats = [
    { number: "1,000+", label: "Happy Customers" },
    { number: "50,000+", label: "Reviews Managed" },
    { number: "4.9/5", label: "Customer Rating" },
    { number: "99.9%", label: "Uptime" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {' '}1,000+ Businesses
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            See what our customers are saying about Review Pilot AI and how it's 
            helping them grow their business.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors duration-300 border border-gray-100"
            >
              {/* Rating Stars */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, starIndex) => (
                  <span key={starIndex} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>

              {/* Testimonial Content */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar}
                  alt={`${testimonial.name} avatar`}
                  className="w-12 h-12 rounded-full mr-4 bg-gray-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-white max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">
              Join These Success Stories
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Start your 14-day free trial today and see why businesses trust 
              Review Pilot AI to manage their online reputation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                Start Free Trial
              </button>
              <button className="px-8 py-4 border-2 border-gray-600 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300">
                Schedule Demo
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
