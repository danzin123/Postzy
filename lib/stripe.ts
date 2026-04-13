import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export const STRIPE_PLANS = {
  STARTER: { priceId: process.env.STRIPE_PRICE_STARTER!, credits: 30,  amount: 4900  },
  PRO:     { priceId: process.env.STRIPE_PRICE_PRO!,     credits: 100, amount: 9900  },
  AGENCY:  { priceId: process.env.STRIPE_PRICE_AGENCY!,  credits: 300, amount: 24900 },
}

export const CREDIT_PACKS = [
  { id: 'pack_10',  credits: 10,  priceId: process.env.STRIPE_PRICE_PACK_10!,  amount: 1990  },
  { id: 'pack_30',  credits: 30,  priceId: process.env.STRIPE_PRICE_PACK_30!,  amount: 4990  },
  { id: 'pack_100', credits: 100, priceId: process.env.STRIPE_PRICE_PACK_100!, amount: 13990 },
]