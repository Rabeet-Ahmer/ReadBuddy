export const getCurrentBillingPeriodStart = (): Date => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    return startOfMonth;
}