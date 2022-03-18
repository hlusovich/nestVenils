import Stripe from "stripe";
import {BadRequestException} from "@nestjs/common";
import {IPaymentCreateDto} from "../src/vinyls/vinyls.interface";
export async function buyWithStripe(email:string, payment:IPaymentCreateDto, stripeKey:string, goodsPrice:number) {
    const stripe = new Stripe(stripeKey, {
        apiVersion: '2020-08-27',
    });
    const customer: Stripe.Customer = await stripe.customers.create({
        email: email,
        payment_method: payment.payment_method,

    });
    try {
        const paymentMethod: Stripe.PaymentMethod = await stripe.paymentMethods.create(
            {
                type: 'card',
                card: {
                    number: payment.number,
                    exp_month: +payment.exp_month,
                    exp_year: +payment.exp_year,
                    cvc: payment.cvc,
                },
            }
        );
        const product: Stripe.Product = await stripe.products.create(
            {name: 'Gold Special'}
        );
        const price:Stripe.Price = await stripe.prices.create(
            {
                unit_amount: goodsPrice * 100,
                currency: 'eur',
                recurring: {interval: 'month'},
                product: product.id,
            }
        );
        const attachPaymentToCustomer: Stripe.PaymentMethod = await stripe.paymentMethods.attach(
            paymentMethod.id,
            {customer: customer.id}
        );
        const updateCustomerDefaultPaymentMethod: Stripe.Customer = await stripe.customers.update(
            customer.id, {

                invoice_settings: {
                    default_payment_method: paymentMethod.id,
                },
            });
        const newSubscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{plan: price.id, quantity: 1}],
            default_payment_method: paymentMethod.id,
        });

    } catch (e) {
        // @ts-ignore
        throw new BadRequestException(e.message);
    }
}
