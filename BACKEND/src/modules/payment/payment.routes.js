import express from "express";

const router = express.Router();

const getStripeClient = async () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        return null;
    }

    try {
        const stripeModule = await import("stripe");
        const Stripe = stripeModule.default;
        return new Stripe(process.env.STRIPE_SECRET_KEY);
    } catch {
        return null;
    }
};

router.post("/create-checkout-session", async (req, res) => {
    const { amount } = req.body;

    const stripe = await getStripeClient();

    if (!stripe) {
        return res.status(503).json({
            message: "Payment service is not configured"
        });
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Mentor Session"
                    },
                    unit_amount: amount * 100
                },
                quantity: 1
            }
        ],
        mode: "payment",
        success_url: "http://localhost:5173/success",
        cancel_url: "http://localhost:5173/cancel"
    });

    res.json({ url: session.url });
});

export default router;