import { loadStripe } from '@stripe/stripe-js'

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    hours: 10,
    priceId: 'price_1ToKspHTjUJCdbgvSu1udGJC',
    description: 'Perfect for getting started',
    features: [
      '10 hours of video per month',
      'Crop, blur & custom styles',
      'Publish to YouTube & Facebook',
      'Download clips',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 59,
    hours: 25,
    priceId: 'price_1ToKu7HTjUJCdbgvcLG0Qni0',
    description: 'For consistent content creators',
    popular: true,
    features: [
      '25 hours of video per month',
      'Crop, blur & custom styles',
      'Publish to YouTube & Facebook',
      'Download clips',
      'Priority processing',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99,
    hours: 60,
    priceId: 'price_1ToKuUHTjUJCdbgv7XRLSwIk',
    description: 'For high-volume creators',
    features: [
      '60 hours of video per month',
      'Crop, blur & custom styles',
      'Publish to YouTube & Facebook',
      'Download clips',
      'Priority processing',
      'Dedicated support',
    ],
  },
]
