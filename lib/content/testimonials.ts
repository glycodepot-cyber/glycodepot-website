export interface Testimonial {
  quote: string;
  author: string;
  title: string;
}

// Add real customer testimonials here when available.
// TestimonialBlock renders nothing when this array is empty.
export const testimonials: Testimonial[] = [];
