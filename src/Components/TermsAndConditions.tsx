import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-5">
        <h4 className="text-3xl font-bold mb-4 text-center">
          Terms and Conditions
        </h4>

        <p className="text-sm text-gray-500 text-center mb-8">
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <section className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            Welcome to <span className="font-semibold">DMV Learning</span>. By
            accessing or using our platform, you agree to be bound by these Terms
            and Conditions. If you do not agree, please do not use our services.
          </p>

          <div>
            <h6 className="text-xl font-semibold mb-2">1. Eligibility</h6>
            <p>
              Users must be at least 13 years old to access our services. Users
              under 18 must have parental or guardian consent.
            </p>
          </div>

          <div>
            <h6 className="text-xl font-semibold mb-2">2. User Accounts</h6>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials. Any activity performed using your account is
              your responsibility.
            </p>
          </div>

          <div>
            <h6 className="text-xl font-semibold mb-2">
              3. Course Access & Usage
            </h6>
            <p>
              Course content is provided for personal educational use only.
              Sharing, reselling, or redistributing content without permission
              is strictly prohibited.
            </p>
          </div>

          <div>
            <h6 className="text-xl font-semibold mb-2">
              4. Payments & Refunds
            </h6>
            <p>
              All payments must be completed before course access is granted.
              Payments are non-refundable unless stated otherwise in a separate
              refund policy.
            </p>
          </div>

          <div>
            <h6 className="text-xl font-semibold mb-2">
              5. Intellectual Property
            </h6>
            <p>
              All content, including videos, text, graphics, and logos, are the
              intellectual property of DMV Learning and may not be used without
              written permission.
            </p>
          </div>

          <div>
            <h6 className="text-xl font-semibold mb-2">6. User Conduct</h6>
            <ul className="list-disc list-inside space-y-1">
              <li>No illegal or unauthorized use</li>
              <li>No sharing of login credentials</li>
              <li>No attempt to disrupt platform security</li>
              <li>No posting harmful or misleading content</li>
            </ul>
          </div>

          <div>
            <h6 className="text-xl font-semibold mb-2">
              7. Limitation of Liability
            </h6>
            <p>
              DMV Learning is not liable for any indirect or consequential
              damages, loss of data, or service interruptions.
            </p>
          </div>

          <div>
            <h6 className="text-xl font-semibold mb-2">
              8. Changes to Terms
            </h6>
            <p>
              DMV Learning reserves the right to update these terms at any time.
              Continued use of the platform constitutes acceptance of the
              updated terms.
            </p>
          </div>

          <div>
            <h6 className="text-xl font-semibold mb-2">9. Governing Law</h6>
            <p>
              These terms are governed by and interpreted in accordance with the
              laws of India.
            </p>
          </div>

          <div>
            <h6 className="text-xl font-semibold mb-2">10. Contact Us</h6>
            <p>
              If you have any questions regarding these Terms and Conditions,
              please contact us at:
            </p>
            <p className="mt-2">
              <span className="font-medium">support@dmvlearning.com</span>
              <br />
              <span className="font-medium">www.dmvlearning.com</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
