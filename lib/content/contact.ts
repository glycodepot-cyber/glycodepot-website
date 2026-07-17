/** Verbatim from live /contact (plus typo "fell" → "feel"). */
export const contactPage = {
  metaTitle: "Contact GlycoDepot | Get Support & Research Assistance",
  heading: "Drop Us A Line",
  intro:
    "If you have any questions, please feel free to get in touch with us. We will reply to you as soon as possible. Thank you!",
  form: {
    submitLabel: "Send message",
    fields: {
      name: { label: "Your name", placeholder: "Jane Researcher" },
      email: { label: "Work email", placeholder: "you@lab.edu" },
      subject: {
        label: "Inquiry type",
        options: [
          "General inquiry",
          "Product question",
          "Bulk / custom synthesis quote",
          "Technical support",
          "Partnership / vendor",
          "Press",
        ],
      },
      message: {
        label: "How can we help?",
        placeholder:
          "Tell us about your project, target glycan, scale, or timeline…",
      },
    },
    successTitle: "Thanks — message received.",
    successBody:
      "We've routed your message to the right specialist. Expect a reply within one business day.",
  },
};
