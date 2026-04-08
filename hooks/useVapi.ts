import { endVoiceSession, startVoiceSession } from "@/lib/actions/session.actions";
import { ASSISTANT_ID, DEFAULT_VOICE, VOICE_SETTINGS } from "@/lib/constants";
import { IBook, Messages } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import Vapi from '@vapi-ai/web'
import { getVoice } from "@/lib/utils";

export type CallStatus = 'idle' | 'connecting' | 'starting' | 'listening' | 'thinking' | 'speaking';

const useLatestRef = <T>(value: T) => {
    const ref = useRef(value)
    useEffect(() => {
        ref.current = value
    }, [value])
    return ref
}

let vapi: InstanceType<typeof Vapi>

function getVapi() {
    if (!vapi) {
        if (!process.env.NEXT_PUBLIC_VAPI_API_KEY) {
            throw new Error('NEXT_PUBLIC_VAPI_API_KEY is not defined');
        }

        vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
    }

    return vapi;
}

export const useVapi = (book: IBook) => {
    const { userId } = useAuth();

    const [status, setStatus] = useState<CallStatus>('idle');
    const [messages, setMessages] = useState<Messages[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [currentUserMessage, setCurrentUserMessage] = useState('');
    const [duration, setDuration] = useState(0);
    const [limitError, setLimitError] = useState<string | null>(null);

    const timeRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<NodeJS.Timeout | null>(null);
    const sessionIdRef = useRef<string | null>(null);
    const isStoppingRef = useRef<boolean>(false);

    const bookRef = useLatestRef(book);
    const durationRef = useLatestRef(duration);
    const voice = book.persona || DEFAULT_VOICE;

    const isActive = status === 'connecting' || status === 'starting' || status === 'listening' || status === 'thinking' || status === 'speaking';

    // *TODO - Limit:
    // const maxDurationRef = useLatestRef(limits.maxSessionMinutes * 60)
    // const maxDurationSeconds
    // const remainingSeconds
    // const showTimeWarning

    const start = async () => {
        if (!userId) return setLimitError('Please log in to start a session');
        
        setLimitError(null);
        setStatus('connecting');

        try {
            const result = await startVoiceSession(userId, book._id);

            if (!result.success) {
                setStatus('idle');
                setLimitError(result.error || 'Failed to start session. Please try again.');
                return;
            }

            sessionIdRef.current = result.sessionId || null;

            const firstMessage = `Hey, good to meet you. Quick question, before we dive in: have you actually read ${book.title} yet? Or are we starting fresh?`

            await getVapi().start(ASSISTANT_ID, {
                firstMessage,
                variableValues: {
                    title: book.title,
                    author: book.author,
                    bookId: book._id
                },
                voice: {
                    provider: '11labs',
                    model: 'eleven_turbo_v2_5' as const,
                    voiceId: getVoice(voice).id,
                    stability: VOICE_SETTINGS.stability,
                    similarityBoost: VOICE_SETTINGS.similarityBoost,
                    style: VOICE_SETTINGS.style,
                    useSpeakerBoost: VOICE_SETTINGS.useSpeakerBoost,
                }
            })
            

        } catch (e) {
            console.error('Failed to start VAPI session:', e);
            if (sessionIdRef.current) {
                endVoiceSession(sessionIdRef.current, 0).catch((endError) => console.error('Failed to rollback session after start failure:', endError));
                sessionIdRef.current = null;
            }
            setStatus('idle');
            setLimitError('Failed to start session. Please try again.');
        }
    }

    // ── VAPI event listeners ──────────────────────────────────────────────
    useEffect(() => {
        const v = getVapi();

        // Call lifecycle
        const onCallStart = () => {
            setStatus('starting');
            startTimeRef.current = setInterval(() => {
                setDuration((d) => d + 1);
            }, 1000) as unknown as NodeJS.Timeout;
        };

        const onCallEnd = () => {
            // Persist session end to the database
            if (sessionIdRef.current) {
                endVoiceSession(sessionIdRef.current, durationRef.current).catch(
                    (err) => console.error('Failed to end voice session:', err)
                );
                sessionIdRef.current = null;
            }

            setStatus('idle');
            setCurrentMessage('');
            setCurrentUserMessage('');
            isStoppingRef.current = false;

            if (startTimeRef.current) {
                clearInterval(startTimeRef.current);
                startTimeRef.current = null;
            }
        };

        // Speech indicators
        const onSpeechStart = () => setStatus('speaking');
        const onSpeechEnd = () => setStatus('listening');

        // Transcript messages
        const onMessage = (msg: any) => {
            if (msg.type !== 'transcript') return;

            const { role, transcriptType, transcript } = msg;

            if (role === 'user') {
                if (transcriptType === 'partial') {
                    // Stream the user voice → live partial text
                    setCurrentUserMessage(transcript);
                } else if (transcriptType === 'final') {
                    // Finalise: clear partial, add to history, set thinking
                    setCurrentUserMessage('');
                    setStatus('thinking');

                    setMessages((prev) => {
                        const last = prev[prev.length - 1];
                        if (last && last.role === 'user' && last.content === transcript) {
                            return prev; // deduplicate
                        }
                        return [...prev, { role: 'user', content: transcript }];
                    });
                }
            }

            if (role === 'assistant') {
                if (transcriptType === 'partial') {
                    // Stream the assistant voice → live partial text
                    setCurrentMessage(transcript);
                } else if (transcriptType === 'final') {
                    // Finalise: clear partial, add to history
                    setCurrentMessage('');
                    setStatus('listening');

                    setMessages((prev) => {
                        const last = prev[prev.length - 1];
                        if (last && last.role === 'assistant' && last.content === transcript) {
                            return prev; // deduplicate
                        }
                        return [...prev, { role: 'assistant', content: transcript }];
                    });
                }
            }
        };

        v.on('call-start', onCallStart);
        v.on('call-end', onCallEnd);
        v.on('speech-start', onSpeechStart);
        v.on('speech-end', onSpeechEnd);
        v.on('message', onMessage);
        v.on('error', (error) => {
            console.error('VAPI error:', error);
            setStatus('idle');
            setLimitError('Failed to start session. Please try again.');
        })

        return () => {
            vapi.removeListener('call-start', onCallStart);
            vapi.removeListener('call-end', onCallEnd);
            vapi.removeListener('speech-start', onSpeechStart);
            vapi.removeListener('speech-end', onSpeechEnd);
            vapi.removeListener('message', onMessage);
            vapi.removeListener('error', (error) => {
                console.error('VAPI error:', error);
                setStatus('idle');
                setLimitError('Failed to start session. Please try again.');
            });
        };
    }, []);

    
    const stop = async () => {
        isStoppingRef.current = true;

        if (sessionIdRef.current) {
            try {
                await endVoiceSession(sessionIdRef.current, durationRef.current);
            } catch (err) {
                console.error('Failed to end voice session on stop:', err);
            }
            sessionIdRef.current = null;
        }

        await getVapi().stop();
    }

    const clearErrors = async () => {}

    return {
        status,
        messages,
        currentMessage,
        currentUserMessage,
        duration,
        limitError,
        start,
        stop,
        clearErrors,
        isActive,
        voice,
        // maxDurationSeconds,
        // remainingSeconds,
        // showTimeWarning
    }
}

export default useVapi;