import React from "react";
import {
  Star,
  Quote,
  User,
  ChevronLeft,
  ChevronRight,
  Circle,
  CheckCircle,
} from "lucide-react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "CTO at TechCorp",
      content:
        "TSX has completely transformed our development workflow. The platform's intuitive interface and powerful features have helped us reduce deployment times by 40% while improving reliability.",
      rating: 5,
      date: "March 15, 2025",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Lead Developer at StartupX",
      content:
        "As a small team, we needed a solution that could scale with us. TSX provided exactly that - from our initial MVP to our current production environment, the platform has grown with our needs.",
      rating: 4,
      date: "February 28, 2025",
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Product Manager at Digital Solutions",
      content:
        "The customer support team at TSX is exceptional. Whenever we've had questions or needed assistance, they've responded quickly with knowledgeable solutions that kept our projects moving forward.",
      rating: 5,
      date: "January 10, 2025",
    },
    {
      id: 4,
      name: "David Kim",
      role: "Senior Engineer at CloudNine",
      content:
        "The API integration tools in TSX saved us weeks of development time. The documentation is clear and comprehensive, making implementation straightforward even for complex systems.",
      rating: 5,
      date: "December 5, 2024",
    },
    {
      id: 5,
      name: "Lisa Wong",
      role: "Director of Engineering at FinTech Inc.",
      content:
        "Security was our top priority when evaluating platforms. TSX's robust security features and compliance certifications gave us the confidence we needed to migrate our financial applications.",
      rating: 4,
      date: "November 20, 2024",
    },
    {
      id: 6,
      name: "James Peterson",
      role: "Founder of DevTools",
      content:
        "The analytics dashboard provides exactly the visibility we need into our application performance. We've been able to identify and resolve bottlenecks before they impact our users.",
      rating: 5,
      date: "October 15, 2024",
    },
  ];

  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToTestimonial = (index: React.SetStateAction<number>) => {
    setCurrentIndex(index);
  };

  return (
    <div className="min-h-screen bg-sky-50">
      <Navbar isLoggedIn={true} />

      <main className="max-w-7xl mx-auto px-6 py-8 pt-20">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Quote className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Customer Testimonials
              </h1>
              <p className="text-gray-600 mt-2">
                Hear what our customers say about their experience with TSX
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Trusted by 1,000+ companies worldwide
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-700">
                Average rating: 4.8/5 from 500+ reviews
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with stats */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Customer Satisfaction
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Overall Rating
                  </h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < 4
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-gray-700">4.8/5</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Rating Breakdown
                  </h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center">
                        <div className="w-8 text-sm font-medium text-gray-500">
                          {stars} star
                        </div>
                        <div className="flex-1 mx-2 h-2.5 bg-gray-200 rounded-full">
                          <div
                            className="h-2.5 bg-blue-600 rounded-full"
                            style={{
                              width: `${
                                stars === 5
                                  ? "85%"
                                  : stars === 4
                                  ? "12%"
                                  : stars === 3
                                  ? "2%"
                                  : stars === 2
                                  ? "1%"
                                  : "0%"
                              }`,
                            }}
                          ></div>
                        </div>
                        <div className="w-8 text-right text-sm text-gray-500">
                          {stars === 5
                            ? "85%"
                            : stars === 4
                            ? "12%"
                            : stars === 3
                            ? "2%"
                            : stars === 2
                            ? "1%"
                            : "0%"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Customer Highlights
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>95% would recommend to others</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>40% faster deployment times</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>24/7 customer support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured testimonial */}
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
              <div className="p-8">
                <div className="flex items-start">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <Quote className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-lg text-gray-700 italic mb-4">
                      "{testimonials[currentIndex].content}"
                    </p>
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonials[currentIndex].rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {testimonials[currentIndex].name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {testimonials[currentIndex].role} •{" "}
                          {testimonials[currentIndex].date}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 px-6 py-4 border-t border-blue-100 flex items-center justify-between">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-blue-600" />
                </button>
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToTestimonial(index)}
                      className="p-1"
                    >
                      <Circle
                        className={`w-2 h-2 ${
                          currentIndex === index
                            ? "text-blue-600"
                            : "text-blue-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-blue-600" />
                </button>
              </div>
            </div>

            {/* All testimonials grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white rounded-xl shadow-md border border-blue-100 p-6"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {testimonial.name}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {testimonial.role} • {testimonial.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="bg-blue-600 rounded-xl shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-3">
                Ready to join our satisfied customers?
              </h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Experience the TSX difference for yourself. Get started today
                and see why developers and businesses love our platform.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-white text-blue-600 font-medium px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                  Start Free Trial
                </button>
                <button className="border-2 border-white text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Testimonials;
