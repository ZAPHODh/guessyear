export default {
  support: "Support",
  title: "Contact Us",
  subtitle: "Have a question or need help? We're here to assist you with anything related to GuessIt.",
  
  form: {
    title: "Send us a Message",
    description: "Fill out the form below and we'll get back to you as soon as possible.",
    name: "Name",
    namePlaceholder: "Your full name",
    email: "Email",
    emailPlaceholder: "your@email.com",
    subject: "Subject",
    subjectPlaceholder: "What's this about?",
    message: "Message",
    messagePlaceholder: "Please describe your issue or question in detail...",
    send: "Send Message",
    
    // Validation messages
    nameRequired: "Name is required",
    nameTooLong: "Name must be less than 100 characters",
    emailRequired: "Email is required",
    emailInvalid: "Please enter a valid email address",
    subjectRequired: "Subject is required",
    subjectTooLong: "Subject must be less than 200 characters",
    messageRequired: "Message is required",
    messageMinLength: "Message must be at least 10 characters",
    messageTooLong: "Message must be less than 2000 characters",
    
    // Success/Error messages
    successTitle: "Message sent successfully!",
    successDescription: "We'll get back to you as soon as possible.",
    errorTitle: "Failed to send message",
    validationErrorTitle: "Validation Error",
    validationErrorDescription: "Please check your form data",
    genericError: "Something went wrong",
    sendFailure: "Failed to send message"
  },
  
  info: {
    title: "Get in Touch",
    email: "Email Support",
    emailDescription: "For general questions and technical support",
    phone: "Phone Support",
    phoneDescription: "Monday - Friday, 9AM - 6PM EST",
    address: "Our Location"
  },
  
  quickHelp: {
    title: "Quick Help",
    faq: "Frequently Asked Questions",
    howToPlay: "How to Play Guide",
    community: "Join Community Chat"
  },
  
  social: {
    title: "Follow Us"
  }
} as const;