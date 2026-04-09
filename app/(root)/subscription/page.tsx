import { PricingTable } from '@clerk/nextjs';

const SubscriptionPage = () => {
  return (
    <main className="clerk-subscriptions">
      <h1 className="page-title">Choose Your Plan</h1>
      <p className="page-description text-(--text-secondary)">
        Unlock more books, longer sessions, and unlimited conversations.
      </p>

      <div className="clerk-pricing-table-wrapper mt-10 w-full">
        <PricingTable />
      </div>
    </main>
  );
};

export default SubscriptionPage;
