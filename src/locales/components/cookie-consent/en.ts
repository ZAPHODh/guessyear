export default {
  title: "We use cookies",
  description: "We use essential cookies to make our site work. We'd also like to set optional cookies to help us improve our website and analyze usage patterns.",
  required: "Required",
  weUse: "We use cookies to enhance your experience.",
  learnMore: "Learn more",
  privacyPolicy: "Privacy Policy",
  
  // Action buttons
  acceptAll: "Accept All",
  rejectAll: "Reject All", 
  customize: "Customize",
  savePreferences: "Save Preferences",
  cancel: "Cancel",
  back: "Back",
  
  // Cookie categories
  essential: {
    title: "Essential Cookies",
    description: "These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you which amount to a request for services.",
    required: "Always Active"
  },
  
  performance: {
    title: "Performance Cookies", 
    description: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us understand how visitors use our website."
  },
  
  functional: {
    title: "Functional Cookies",
    description: "These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages."
  },
  
  marketing: {
    title: "Marketing Cookies",
    description: "These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites."
  },
  
  // Compliance information
  compliance: {
    gdpr: "🇪🇺 GDPR compliant - You have the right to control your data",
    ccpa: "🇺🇸 CCPA compliant - California residents can opt-out of data sales", 
    lgpd: "🇧🇷 LGPD compliant - Your data is protected under Brazilian law"
  },
  
  // Settings dialog
  settings: {
    title: "Cookie Preferences",
    description: "Manage your cookie preferences. You can enable or disable different types of cookies below. Note that disabling some types of cookies may impact your experience of the site and the services we are able to offer."
  },
  
  // Legal information
  legal: {
    dataController: "Data Controller",
    retention: "We retain cookie consent for 12 months",
    withdraw: "You can withdraw your consent at any time by visiting this settings page",
    contact: "For questions about cookies, contact us at",
    rights: "Under GDPR, LGPD and CCPA, you have rights including access, rectification, erasure, and data portability"
  }
} as const;