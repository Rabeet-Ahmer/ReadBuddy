'use client'

import { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload, ImageIcon, X } from 'lucide-react'

import { UploadSchema } from '@/lib/zod'
import { voiceOptions, voiceCategories, DEFAULT_VOICE } from '@/lib/constants'
import LoadingOverlay from '@/components/LoadingOverlay'
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { BookUploadFormValues } from '@/types'

const UploadForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const pdfInputRef = useRef<HTMLInputElement>(null)
    const coverInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<BookUploadFormValues>({
        resolver: zodResolver(UploadSchema) as any,
        defaultValues: {
            title: '',
            author: '',
            voice: DEFAULT_VOICE,
        },
    })

    const selectedVoice = form.watch('voice')

    // ----- Submit -----
    const onSubmit = async (data: BookUploadFormValues) => {
        setIsSubmitting(true)
        try {
            // TODO: implement actual upload logic
            console.log('Form submitted:', data)
            await new Promise((r) => setTimeout(r, 2000)) // simulate
        } catch (err) {
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            {isSubmitting && <LoadingOverlay />}

            <form
                id="upload-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="new-book-wrapper space-y-8"
            >
                <FieldGroup>
                    {/* ========== PDF Upload ========== */}
                    <Controller
                        name="pdf"
                        control={form.control}
                        render={({ field, fieldState }) => {
                            const file = field.value as File | undefined
                            return (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="form-label">Book PDF File</FieldLabel>
                                    <input
                                        ref={pdfInputRef}
                                        type="file"
                                        accept=".pdf,application/pdf"
                                        className="hidden"
                                        onChange={(e) => {
                                            const f = e.target.files?.[0]
                                            if (f) field.onChange(f)
                                        }}
                                    />
                                    <div
                                        className={`upload-dropzone border-2 border-dashed border-(--border-medium) ${file ? 'upload-dropzone-uploaded' : ''}`}
                                        onClick={() => pdfInputRef.current?.click()}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault()
                                                pdfInputRef.current?.click()
                                            }
                                        }}
                                        aria-invalid={fieldState.invalid}
                                    >
                                        {file ? (
                                            <div className="flex items-center gap-3">
                                                <Upload className="w-5 h-5 text-[#663820]" />
                                                <span className="upload-dropzone-text text-[#663820] font-medium">
                                                    {file.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        field.onChange(undefined)
                                                        if (pdfInputRef.current) pdfInputRef.current.value = ''
                                                    }}
                                                    className="upload-dropzone-remove"
                                                    aria-label="Remove PDF"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="upload-dropzone-icon" />
                                                <span className="upload-dropzone-text">Click to upload PDF</span>
                                                <span className="upload-dropzone-hint">PDF file (max 50MB)</span>
                                            </>
                                        )}
                                    </div>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )
                        }}
                    />

                    {/* ========== Cover Image Upload ========== */}
                    <Controller
                        name="cover"
                        control={form.control}
                        render={({ field, fieldState }) => {
                            const file = field.value as File | undefined
                            return (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="form-label">Cover Image (Optional)</FieldLabel>
                                    <input
                                        ref={coverInputRef}
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        className="hidden"
                                        onChange={(e) => {
                                            const f = e.target.files?.[0]
                                            if (f) field.onChange(f)
                                        }}
                                    />
                                    <div
                                        className={`upload-dropzone border-2 border-dashed border-(--border-medium) ${file ? 'upload-dropzone-uploaded' : ''}`}
                                        onClick={() => coverInputRef.current?.click()}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && coverInputRef.current?.click()}
                                        aria-invalid={fieldState.invalid}
                                    >
                                        {file ? (
                                            <div className="flex items-center gap-3">
                                                <ImageIcon className="w-5 h-5 text-[#663820]" />
                                                <span className="upload-dropzone-text text-[#663820] font-medium">
                                                    {file.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        field.onChange(undefined)
                                                        if (coverInputRef.current) coverInputRef.current.value = ''
                                                    }}
                                                    className="upload-dropzone-remove"
                                                    aria-label="Remove cover image"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <ImageIcon className="upload-dropzone-icon" />
                                                <span className="upload-dropzone-text">Click to upload cover image</span>
                                                <span className="upload-dropzone-hint">Leave empty to auto-generate from PDF</span>
                                            </>
                                        )}
                                    </div>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )
                        }}
                    />

                    {/* ========== Title ========== */}
                    <Controller
                        name="title"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="upload-title" className="form-label">Title</FieldLabel>
                                <Input
                                    {...field}
                                    id="upload-title"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="ex: Rich Dad Poor Dad"
                                    className="form-input border border-(--border-subtle) shadow-(--shadow-soft-sm)"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* ========== Author ========== */}
                    <Controller
                        name="author"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="upload-author" className="form-label">Author Name</FieldLabel>
                                <Input
                                    {...field}
                                    id="upload-author"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="ex: Robert Kiyosaki"
                                    className="form-input border border-(--border-subtle) shadow-(--shadow-soft-sm)"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* ========== Voice Selector ========== */}
                    <Controller
                        name="voice"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="form-label">Choose Assistant Voice</FieldLabel>

                                {/* Male Voices */}
                                <p className="text-sm font-medium text-(--text-secondary) mb-2 mt-1">Male Voices</p>
                                <div className="voice-selector-options">
                                    {voiceCategories.male.map((key) => {
                                        const voice = voiceOptions[key as keyof typeof voiceOptions]
                                        const isSelected = selectedVoice === key
                                        return (
                                            <label
                                                key={key}
                                                className={`voice-selector-option ${isSelected ? 'voice-selector-option-selected' : 'voice-selector-option-default'}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={field.name}
                                                    value={key}
                                                    checked={field.value === key}
                                                    onChange={() => field.onChange(key)}
                                                    className="accent-[#663820]"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-(--text-primary)">{voice.name}</span>
                                                    <span className="text-xs text-(--text-secondary) italic">{voice.description}</span>
                                                </div>
                                            </label>
                                        )
                                    })}
                                </div>

                                {/* Female Voices */}
                                <p className="text-sm font-medium text-(--text-secondary) mb-2 mt-4">Female Voices</p>
                                <div className="voice-selector-options">
                                    {voiceCategories.female.map((key) => {
                                        const voice = voiceOptions[key as keyof typeof voiceOptions]
                                        const isSelected = selectedVoice === key
                                        return (
                                            <label
                                                key={key}
                                                className={`voice-selector-option ${isSelected ? 'voice-selector-option-selected' : 'voice-selector-option-default'}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={field.name}
                                                    value={key}
                                                    checked={field.value === key}
                                                    onChange={() => field.onChange(key)}
                                                    className="accent-[#663820]"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-(--text-primary)">{voice.name}</span>
                                                    <span className="text-xs text-(--text-secondary) italic">{voice.description}</span>
                                                </div>
                                            </label>
                                        )
                                    })}
                                </div>

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>

                {/* ========== Submit ========== */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="form-btn"
                >
                    {isSubmitting ? 'Processing…' : 'Begin Synthesis'}
                </button>
            </form>
        </>
    )
}

export default UploadForm