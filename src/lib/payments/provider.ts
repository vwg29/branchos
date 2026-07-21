// Payment provider abstraction. Currently a mock; swap for Stripe/Moyasar later
// by implementing the same interface.
export interface Checkout {
  id: string;
  url: string;
  planSlug: string;
  status: "pending" | "paid" | "failed";
}

export interface PaymentProvider {
  createCheckout(input: { planSlug: string; tenantId: string }): Promise<Checkout>;
  verify(checkoutId: string): Promise<Checkout>;
}

class MockPaymentProvider implements PaymentProvider {
  async createCheckout(input: { planSlug: string; tenantId: string }): Promise<Checkout> {
    const id = `mock_${Date.now()}`;
    return {
      id,
      url: `/api/billing?mockCheckout=${id}`,
      planSlug: input.planSlug,
      status: "pending",
    };
  }

  async verify(checkoutId: string): Promise<Checkout> {
    return { id: checkoutId, url: "", planSlug: "", status: "paid" };
  }
}

export const paymentProvider: PaymentProvider = new MockPaymentProvider();
