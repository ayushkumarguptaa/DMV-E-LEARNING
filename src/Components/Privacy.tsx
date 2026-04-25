import React from "react";
import { ShieldCheck, Lock, Eye, Database, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-10 p-5">
        {/* Header */}
        <div className="text-center mb-10">
          <ShieldCheck className="mx-auto h-12 w-12 text-blue-600 mb-3" />
          <h1 className="text-3xl font-bold text-gray-800">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>
            At <span className="font-semibold">DMV Learning</span>, we value your
            privacy and are committed to protecting your personal information.
            This Privacy Policy explains how we collect, use, store, and protect
            your data when you use our platform.
          </p>

          {/* Section */}
          <section className="flex gap-4">
            {/* <Eye className="h-6 w-6 text-blue-500 mt-1" /> */}
            <div>
              <h2 className="text-xl font-semibold mb-2">
                1. Information We Collect
              </h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Personal information (name, email, phone number)</li>
                <li>Account and login details</li>
                <li>Course enrollment and progress data</li>
                <li>Payment and transaction details</li>
                <li>Device and usage information</li>
              </ul>
            </div>
          </section>

          <section className="flex gap-4">
            {/* <Database className="h-6 w-6 text-green-500 mt-1" /> */}
            <div>
              <h2 className="text-xl font-semibold mb-2">
                2. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-1">
                <li>To provide and manage our services</li>
                <li>To process payments and enrollments</li>
                <li>To communicate important updates</li>
                <li>To improve platform performance</li>
                <li>To ensure platform security</li>
              </ul>
            </div>
          </section>

          <section className="flex gap-4">
            {/* <Lock className="h-6 w-6 text-purple-500 mt-1" /> */}
            <div>
              <h2 className="text-xl font-semibold mb-2">
                3. Data Protection & Security
              </h2>
              <p>
                We implement industry-standard security measures to protect your
                data from unauthorized access, misuse, or disclosure. However,
                no method of data transmission over the internet is 100% secure.
              </p>
            </div>
          </section>

          <section className="flex gap-4">
            {/* <ShieldCheck className="h-6 w-6 text-emerald-500 mt-1" /> */}
            <div>
              <h2 className="text-xl font-semibold mb-2">
                4. Sharing of Information
              </h2>
              <p>
                We do not sell or rent your personal data. Information may be
                shared only with trusted service providers (such as payment
                gateways) or when required by law.
              </p>
            </div>
          </section>

          <section className="flex gap-4">
            {/* <Eye className="h-6 w-6 text-orange-500 mt-1" /> */}
            <div>
              <h2 className="text-xl font-semibold mb-2">
                5. Cookies & Tracking
              </h2>
              <p>
                We use cookies and similar technologies to enhance user
                experience, analyze usage patterns, and improve our services.
                You may disable cookies in your browser settings.
              </p>
            </div>
          </section>

          <section className="flex gap-4">
            {/* <Mail className="h-6 w-6 text-red-500 mt-1" /> */}
            <div>
              <h2 className="text-xl font-semibold mb-2">
                6. Your Rights
              </h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Access and update your personal data</li>
                <li>Request deletion of your account</li>
                <li>Withdraw consent for communications</li>
              </ul>
            </div>
          </section>

          <section className="flex gap-4">
            {/* <ShieldCheck className="h-6 w-6 text-blue-600 mt-1" /> */}
            <div>
              <h2 className="text-xl font-semibold mb-2">
                7. Policy Updates
              </h2>
              <p>
                DMV Learning may update this Privacy Policy from time to time.
                Continued use of our services after changes indicates acceptance
                of the updated policy.
              </p>
            </div>
          </section>

          <section className="flex gap-4">
            {/* <Mail className="h-6 w-6 text-gray-600 mt-1" /> */}
            <div>
              <h2 className="text-xl font-semibold mb-2">
                8. Contact Us
              </h2>
              <p>
                If you have any questions regarding this Privacy Policy, please
                contact us:
              </p>
              <p className="mt-2 font-medium">
                Support: support@dmvlearning.com <br />
                Email: www.dmvlearning.com
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
