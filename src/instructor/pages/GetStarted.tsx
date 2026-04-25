import { useState } from "react";
import "../../index.css";

type Step = {
  id: number;
  title: string;
  description: string;
};

export default function InstructorRegistrationProcess() {
  const [currentStep, setCurrentStep] = useState<number>(2); 
  // You can change this number (0–4) to simulate progress

  const steps: Step[] = [
    {
      id: 0,
      title: "Fill Registration Form",
      description: "Instructor submits personal and professional details.",
    },
    {
      id: 1,
      title: "Form Submitted",
      description: "Your request has been successfully submitted.",
    },
    {
      id: 2,
      title: "Admin Review",
      description: "Admin is reviewing your application.",
    },
    {
      id: 3,
      title: "Approval",
      description: "Your account is approved by admin.",
    },
    {
      id: 4,
      title: "First Login",
      description: "You can log in and change your password.",
    },
  ];

  return (
    <div className="process-wrapper">
      <h2 className="process-title">Instructor Registration Process</h2>

      <div className="process-steps">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`process-step 
              ${step.id < currentStep ? "completed" : ""} 
              ${step.id === currentStep ? "active" : ""}`}
          >
            <div className="step-circle">{step.id + 1}</div>
            <div className="step-content">
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="process-status">
        <strong>Status:</strong>{" "}
        {currentStep < steps.length - 1
          ? steps[currentStep].title
          : "Registration Completed"}
      </div>
    </div>
  );
}
