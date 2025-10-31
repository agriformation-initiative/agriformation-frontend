
// import { NextRequest, NextResponse } from 'next/server';
// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2025-09-30.clover' as any,
// });

// export async function POST(req: NextRequest) {
//   try {
//     const { amount, donationType } = await req.json();

//     // Validate amount
//     if (!amount || amount < 1000) {
//       return NextResponse.json(
//         { error: 'Amount must be at least ₦1,000' },
//         { status: 400 }
//       );
//     }

//     // Validate donation type
//     if (!['one-time', 'monthly'].includes(donationType)) {
//       return NextResponse.json(
//         { error: 'Invalid donation type' },
//         { status: 400 }
//       );
//     }

//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

//     if (donationType === 'one-time') {
//       // Create one-time payment session
//       const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         line_items: [
//           {
//             price_data: {
//               currency: 'ngn',
//               product_data: {
//                 name: 'Donation to Agricultural Education',
//                 description: 'Support transforming agricultural education in Nigeria',
//                 images: [`${baseUrl}/images/logo.png`],
//               },
//               unit_amount: amount * 100, // Stripe uses smallest currency unit
//             },
//             quantity: 1,
//           },
//         ],
//         mode: 'payment',
//         success_url: `${baseUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
//         cancel_url: `${baseUrl}/donate?canceled=true`,
//         metadata: {
//           donationType: 'one-time',
//           amount: amount.toString(),
//         },
//       });

//       return NextResponse.json({ url: session.url });
//     } else {
//       // Create recurring subscription session
//       // First, create or retrieve a product
//       const product = await stripe.products.create({
//         name: 'Monthly Donation - Agricultural Education',
//         description: 'Monthly recurring donation to support agricultural education',
//       });

//       // Create a price for the subscription
//       const price = await stripe.prices.create({
//         product: product.id,
//         unit_amount: amount * 100,
//         currency: 'ngn',
//         recurring: {
//           interval: 'month',
//         },
//       });

//       const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         line_items: [
//           {
//             price: price.id,
//             quantity: 1,
//           },
//         ],
//         mode: 'subscription',
//         success_url: `${baseUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
//         cancel_url: `${baseUrl}/donate?canceled=true`,
//         metadata: {
//           donationType: 'monthly',
//           amount: amount.toString(),
//         },
//       });

//       return NextResponse.json({ url: session.url });
//     }
//   } catch (error) {
//     console.error('Error creating checkout session:', error);
//     return NextResponse.json(
//       { error: 'Failed to create checkout session' },
//       { status: 500 }
//     );
//   }
// }