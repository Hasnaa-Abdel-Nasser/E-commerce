//url front-end take
import Stripe from "stripe";
// import * as dotenv from 'dotenv';
// dotenv.config();
async function payment ({
    payment_method_types = ['card'],
    mode = 'payment',
    customer_email = '',
    metadata={},
    cancel_url= process.env.CANCEL_URL,
    success_url= process.env.SUCCESS_URL,
    discounts = [],
    line_items = []
}={}){
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
        payment_method_types,
        mode,
        customer_email,
        metadata,
        cancel_url,
        success_url,
        discounts,
        line_items
    });
    return session;
}
export default payment;