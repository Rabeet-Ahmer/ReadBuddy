'use server';

import VoiceSession from "@/database/models/voiceSession.model";
import { connectToDatabase } from "@/database/mongoose";
import { EndSessionResult, StartSessionResult } from "@/types";
import { getCurrentBillingPeriodStart } from "../subscription-constants";


export const startVoiceSession = async (clerkId: string, bookId: string): Promise<StartSessionResult> => {
    try {
        await connectToDatabase();

        // Check subscription limits before allowing session
        const { checkSessionLimit } = await import('@/lib/subscription');
        const limitCheck = await checkSessionLimit(clerkId);
        if (!limitCheck.allowed) {
            return {
                success: false,
                error: limitCheck.error,
            };
        }

        const session = await VoiceSession.create({
            clerkId,
            bookId,
            startedAt: new Date(),
            billingPeriodStart: getCurrentBillingPeriodStart(),
            durationSeconds: 0,
        });

        return {
            success: true,
            sessionId: session._id.toString(),
            maxDurationMinutes: limitCheck.maxDurationMinutes,
        };
    } catch (e) {
        console.error("Error starting voice session:", e);
        return {
            success: false,
            error: "Failed to start voice session",
        };
    }
}

export const endVoiceSession = async (
    sessionId: string,
    durationSeconds: number
): Promise<EndSessionResult> => {
    try {
        await connectToDatabase();

        const session = await VoiceSession.findByIdAndUpdate(sessionId, {
            endedAt: new Date(),
            durationSeconds,
        });

        if (!session) return { success: false, error: 'Voice session not found' };

        return { success: true };
    } catch (e) {
        console.error("Error ending voice session:", e);
        return { success: false, error: "Failed to end voice session" };
    }
}

