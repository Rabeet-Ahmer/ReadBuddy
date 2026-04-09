import { PlanLimits, PlanType } from '@/types';

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
    free_user: {
        maxBooks: 5,
        maxSessionsPerMonth: 5,
        maxDurationMinutes: 15,
    },
    standard: {
        maxBooks: 10,
        maxSessionsPerMonth: 100,
        maxDurationMinutes: 30,
    },
    pro: {
        maxBooks: 100,
        maxSessionsPerMonth: null, // unlimited
        maxDurationMinutes: 60,
    },
};

export const PLAN_SLUGS: PlanType[] = ['free_user', 'standard', 'pro'];

export const getCurrentBillingPeriodStart = (): Date => {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
};
