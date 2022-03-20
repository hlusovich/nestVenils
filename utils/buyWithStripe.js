"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyWithStripe = void 0;
const stripe_1 = require("stripe");
const common_1 = require("@nestjs/common");
async function buyWithStripe(email, payment, stripeKey, goodsPrice) {
    const stripe = new stripe_1.default(stripeKey, {
        apiVersion: '2020-08-27',
    });
    const customer = await stripe.customers.create({
        email: email,
        payment_method: payment.payment_method,
    });
    try {
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: payment.number,
                exp_month: +payment.exp_month,
                exp_year: +payment.exp_year,
                cvc: payment.cvc,
            },
        });
        const product = await stripe.products.create({ name: 'Gold Special' });
        const price = await stripe.prices.create({
            unit_amount: goodsPrice * 100,
            currency: 'eur',
            recurring: { interval: 'month' },
            product: product.id,
        });
        const attachPaymentToCustomer = await stripe.paymentMethods.attach(paymentMethod.id, { customer: customer.id });
        const updateCustomerDefaultPaymentMethod = await stripe.customers.update(customer.id, {
            invoice_settings: {
                default_payment_method: paymentMethod.id,
            },
        });
        const newSubscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ plan: price.id, quantity: 1 }],
            default_payment_method: paymentMethod.id,
        });
    }
    catch (e) {
        throw new common_1.BadRequestException(e.message);
    }
}
exports.buyWithStripe = buyWithStripe;
//# sourceMappingURL=buyWithStripe.js.map