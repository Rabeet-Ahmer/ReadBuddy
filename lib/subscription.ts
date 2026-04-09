'use server';

import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/database/mongoose';
import Book from '@/database/models/book.model';
import VoiceSession from '@/database/models/voiceSession.model';
import { BookLimitCheckResult, PlanType, SessionCheckResult } from '@/types';
import { getCurrentBillingPeriodStart, PLAN_LIMITS } from './subscription-constants';

/**
 * Determine the user's current plan using Clerk's has() method.
 * Checks from highest tier down; defaults to free_user.
 */
export const getUserPlan = async (): Promise<PlanType> => {
    const { has } = await auth();

    if (has({ plan: 'pro' })) return 'pro';
    if (has({ plan: 'standard' })) return 'standard';
    return 'free_user';
};

/**
 * Check whether the user can create another book under their plan.
 */
export const checkBookLimit = async (clerkId: string): Promise<BookLimitCheckResult> => {
    try {
        const plan = await getUserPlan();
        const limits = PLAN_LIMITS[plan];

        await connectToDatabase();
        const currentCount = await Book.countDocuments({ clerkId });

        if (currentCount >= limits.maxBooks) {
            return {
                allowed: false,
                currentCount,
                limit: limits.maxBooks,
                plan,
                error: `You've reached the maximum of ${limits.maxBooks} books on the ${plan === 'free_user' ? 'Free' : plan.charAt(0).toUpperCase() + plan.slice(1)} plan. Upgrade to add more books.`,
            };
        }

        return { allowed: true, currentCount, limit: limits.maxBooks, plan };
    } catch (e) {
        console.error('Error checking book limit:', e);
        return { allowed: true, currentCount: 0, limit: 0, plan: 'free_user' };
    }
};

/**
 * Check whether the user can start a new voice session this billing period.
 */
export const checkSessionLimit = async (clerkId: string): Promise<SessionCheckResult> => {
    try {
        const plan = await getUserPlan();
        const limits = PLAN_LIMITS[plan];

        // Unlimited sessions for this plan
        if (limits.maxSessionsPerMonth === null) {
            return {
                allowed: true,
                limit: null,
                plan,
                maxDurationMinutes: limits.maxDurationMinutes,
            };
        }

        await connectToDatabase();
        const billingStart = getCurrentBillingPeriodStart();
        const currentCount = await VoiceSession.countDocuments({
            clerkId,
            billingPeriodStart: billingStart,
        });

        if (currentCount >= limits.maxSessionsPerMonth) {
            return {
                allowed: false,
                currentCount,
                limit: limits.maxSessionsPerMonth,
                plan,
                maxDurationMinutes: limits.maxDurationMinutes,
                error: `You've used all ${limits.maxSessionsPerMonth} sessions this month on the ${plan === 'free_user' ? 'Free' : plan.charAt(0).toUpperCase() + plan.slice(1)} plan. Upgrade for more sessions.`,
            };
        }

        return {
            allowed: true,
            currentCount,
            limit: limits.maxSessionsPerMonth,
            plan,
            maxDurationMinutes: limits.maxDurationMinutes,
        };
    } catch (e) {
        console.error('Error checking session limit:', e);
        return { allowed: true, limit: 0, plan: 'free_user', maxDurationMinutes: 15 };
    }
};
