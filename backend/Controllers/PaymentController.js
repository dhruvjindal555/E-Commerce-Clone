const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET)

const createPayment = async (req, res) => {
    const { amount, currency = 'inr' } = req.body; // Amount in cents
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency
        });
        res.send({ client_secret: paymentIntent.client_secret });
    } catch (error) {
        console.log(error);        
        res.status(500).send({ error: error.message });
    }
}



module.exports = { createPayment }