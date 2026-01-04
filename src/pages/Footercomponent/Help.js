import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Help = () => {
  const [openSection, setOpenSection] = useState(null);

  const faqData = [
    {
      title: "Getting Started",
      icon: "🚀",
      questions: [
        {
          question: "How do I create an account?",
          answer: "Click on the 'Login' button in the header, then click 'Create Account' at the bottom of the login form. Fill in your details and verify your email to get started."
        },
        {
          question: "How do I post a property listing?",
          answer: "After logging in, click on 'Post Add' in the header. Fill out the property details form including images, price, location, and amenities. Submit to make your listing live."
        },
        {
          question: "What information do I need to post a property?",
          answer: "You'll need: property title, description, price, location, university area, number of bedrooms/bathrooms, gender preference, contact details, and at least one property image."
        }
      ]
    },
    {
      title: "Property Listings",
      icon: "🏠",
      questions: [
        {
          question: "How do I find properties near my university?",
          answer: "Browse properties by university on the home page, or use the search and filter options to find properties in specific areas or with particular amenities."
        },
        {
          question: "Can I contact property owners directly?",
          answer: "Yes! Each property listing shows the owner's contact information. You can call or email them directly to arrange viewings or ask questions."
        },
        {
          question: "How do I know if a property is available?",
          answer: "Properties are listed in real-time. If you see a listing, it should be available. Contact the owner to confirm availability and arrange viewings."
        },
        {
          question: "What should I check before renting?",
          answer: "Always visit the property in person, check all amenities, read the rental agreement carefully, understand payment terms, and ask about utility costs and house rules."
        }
      ]
    },
    {
      title: "Account & Security",
      icon: "🔐",
      questions: [
        {
          question: "How do I reset my password?",
          answer: "Click 'Forgot Password?' on the login page. Enter your email and follow the instructions sent to your email to reset your password."
        },
        {
          question: "Is my personal information secure?",
          answer: "Yes, we use secure encryption and never share your personal information with third parties. Your contact details are only visible to property owners when you contact them."
        },
        {
          question: "How do I update my profile information?",
          answer: "Go to your Dashboard after logging in. You can edit your profile details, contact information, and preferences there."
        }
      ]
    },
    {
      title: "Payments & Rent",
      icon: "💰",
      questions: [
        {
          question: "How do I pay rent?",
          answer: "Rent payments are arranged directly with property owners. We don't handle payments - you'll work out payment methods and schedules with your landlord."
        },
        {
          question: "What's the difference between monthly and one-time payments?",
          answer: "Monthly payments are recurring rent payments, while one-time payments are for deposits, security fees, or short-term stays. Check each listing for specific payment terms."
        },
        {
          question: "Are there any hidden fees?",
          answer: "We don't charge any fees for using the platform. However, property owners may have their own fees for deposits, utilities, or maintenance. Always ask about all costs upfront."
        }
      ]
    },
    {
      title: "Support & Issues",
      icon: "🆘",
      questions: [
        {
          question: "What if I have a problem with a property owner?",
          answer: "Try to resolve issues directly with the property owner first. If problems persist, contact us through the Contact Us page and we'll help mediate the situation."
        },
        {
          question: "How do I report inappropriate content?",
          answer: "If you see inappropriate content or behavior, use the feedback form or contact us immediately. We review all reports and take appropriate action."
        },
        {
          question: "Can I get a refund if I'm not satisfied?",
          answer: "Refund policies depend on individual property owners and rental agreements. We recommend discussing refund policies before making any payments."
        }
      ]
    },
    {
      title: "Platform Features",
      icon: "⚙️",
      questions: [
        {
          question: "How do I save favorite properties?",
          answer: "While browsing properties, you can bookmark listings you're interested in. These will be saved in your Dashboard for easy access later."
        },
        {
          question: "Can I set up property alerts?",
          answer: "Currently, you can browse all available properties. We're working on adding alert features for new listings in your preferred areas."
        },
        {
          question: "How do I leave feedback about properties?",
          answer: "After staying at a property, you can leave reviews and ratings. This helps other students make informed decisions about their accommodation."
        }
      ]
    }
  ];

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-lg">
            Find answers to common questions about finding and renting boarding properties
          </p>
        </motion.div>

        {/* FAQ Sections */}
        <div className="space-y-6">
          {faqData.map((section, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(sectionIndex)}
                className="w-full px-6 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-left hover:from-teal-600 hover:to-teal-700 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{section.icon}</span>
                    <h2 className="text-xl font-semibold">{section.title}</h2>
                  </div>
                  <span className={`text-2xl transition-transform duration-200 ${
                    openSection === sectionIndex ? 'rotate-180' : ''
                  }`}>
                    ▼
                  </span>
                </div>
              </button>

              {/* Section Content */}
              {openSection === sectionIndex && (
                <motion.div
                  className="px-6 py-4 bg-gray-50"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    {section.questions.map((item, questionIndex) => (
                      <motion.div
                        key={questionIndex}
                        className="bg-white rounded-lg p-4 border border-gray-200"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: questionIndex * 0.1 }}
                      >
                        <h3 className="font-semibold text-gray-800 mb-2">
                          {item.question}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {item.answer}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Still Need Help?
            </h3>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Our support team is here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contactus"
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Contact Support
              </a>
              <a
                href="/FeedbackPage"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Send Feedback
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Help;