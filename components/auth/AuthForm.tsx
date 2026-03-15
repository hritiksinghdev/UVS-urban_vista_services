'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { auth } from '@/lib/firebase'
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile
} from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2, ArrowRight, ChevronLeft, CheckCircle2 } from 'lucide-react'

type Screen =
    | 'signin'
    | 'signup'
    | 'verify-email-otp'
    | 'forgot-email'
    | 'forgot-otp'
    | 'new-password'
    | 'success'

const BUSINESS_TYPES = [
    'Restaurant & Food',
    'Retail Shop',
    'Fashion & Clothing',
    'Real Estate',
    'Healthcare & Clinic',
    'Education & Coaching',
    'Photography Studio',
    'Tech Startup',
    'Hotel & Hospitality',
    'Other'
]

function OTPBoxes({ onComplete, loading }: { onComplete: (otp: string) => void; loading: boolean }) {
    const [values, setValues] = useState(['', '', '', '', '', ''])
    const refs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ]

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return
        const newValues = [...values]
        if (value.length > 1) {
            // Handle paste
            const digits = value.replace(/\D/g, '').split('').slice(0, 6)
            const filled = [...newValues]
            digits.forEach((d, i) => { if (i < 6) filled[i] = d })
            setValues(filled)
            refs[Math.min(digits.length, 5)]?.current?.focus()
            if (digits.length === 6) onComplete(digits.join(''))
            return
        }
        newValues[index] = value
        setValues(newValues)
        if (value && index < 5) refs[index + 1]?.current?.focus()
        if (newValues.every(v => v !== '') && newValues.join('').length === 6) {
            onComplete(newValues.join(''))
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !values[index] && index > 0) {
            refs[index - 1]?.current?.focus()
        }
    }

    return (
        <div className="flex gap-3 justify-center">
            {values.map((val, i) => (
                <input
                    key={i}
                    ref={refs[i]}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={val}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    disabled={loading}
                    className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all disabled:opacity-50"
                />
            ))}
        </div>
    )
}

export default function AuthForm({ initialMode = 'signup' }: { initialMode?: 'signup' | 'signin' }) {
    const [screen, setScreenState] = useState<Screen>(initialMode)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Switch screen helper to reset states
    const switchScreen = (newScreen: Screen) => {
        setError('')
        setSuccess('')
        setLoading(false)
        setScreenState(newScreen)
    }

    // Signup fields
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [businessType, setBusinessType] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // OTP / Forgot
    const [otpEmail, setOtpEmail] = useState('')
    const [verifiedOtp, setVerifiedOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [countdown, setCountdown] = useState(60)
    const [canResend, setCanResend] = useState(false)
    
    // Post-signin profile verification loading text
    const [postLoginMessage, setPostLoginMessage] = useState('')

    const router = useRouter()

    useEffect(() => {
        if (screen === 'verify-email-otp' || screen === 'forgot-otp') {
            setCountdown(60)
            setCanResend(false)
        }
    }, [screen])

    useEffect(() => {
        if ((screen === 'verify-email-otp' || screen === 'forgot-otp') && countdown > 0) {
            const t = setTimeout(() => setCountdown(c => c - 1), 1000)
            return () => clearTimeout(t)
        } else if (countdown === 0) {
            setCanResend(true)
        }
    }, [countdown, screen])

    const handleResendOtp = useCallback(async () => {
        setCanResend(false)
        setCountdown(60)
        try {
            await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: otpEmail, type: screen === 'forgot-otp' ? 'PASSWORD_RESET' : 'EMAIL_VERIFY', name })
            })
            setSuccess('New code sent!')
        } catch {
            setError('Failed to resend code')
        }
    }, [otpEmail, screen, name])

    const handleSignin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setPostLoginMessage('')
        try {
            const credential = await signInWithEmailAndPassword(auth, email.trim(), password)
            const token = await credential.user.getIdToken(true)
            document.cookie = `urbanvista-token=${token}; path=/; max-age=86400; SameSite=Lax; Secure`

            // Sync user
            await fetch('/api/auth/sync-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ name: credential.user.displayName })
            })

            // Check if admin
            setPostLoginMessage('Signing you in...')
            const profileRes = await fetch('/api/user/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (profileRes.ok) {
                const data = await profileRes.json()
                if (data.user?.role === 'ADMIN') {
                    router.push('/dashboard/admin')
                    return
                }
            }
            router.push('/dashboard')
        } catch (err: unknown) {
            const { FirebaseError } = await import('firebase/app')
            if (err instanceof FirebaseError) {
                const msgs: Record<string, string> = {
                    'auth/user-not-found': 'No account found. Sign up instead.',
                    'auth/wrong-password': 'Incorrect password.',
                    'auth/invalid-credential': 'Invalid email or password.',
                    'auth/too-many-requests': 'Too many attempts. Try again later.'
                }
                setError(msgs[err.code] || err.message)
            } else {
                setError(err instanceof Error ? err.message : 'Sign in failed')
            }
            setLoading(false)
            setPostLoginMessage('')
        }
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !email || !phone || !password || !confirmPassword || !businessType) {
            setError('All fields are required')
            return
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }
        setLoading(true)
        setError('')
        try {
            // STEP 1: Send OTP FIRST before creating Firebase account
            const otpRes = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), type: 'EMAIL_VERIFY', name })
            })

            if (!otpRes.ok) throw new Error('Failed to send verification email')

            setOtpEmail(email.trim())
            switchScreen('verify-email-otp')
            setSuccess('Verification code sent to ' + email)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Signup initialization failed')
            setLoading(false)
        }
    }

    const handleVerifyEmailOTP = async (otp: string) => {
        setLoading(true)
        setError('')
        try {
            // STEP 2: Verify OTP
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: otpEmail, otp, type: 'EMAIL_VERIFY' }) // No uid yet
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Invalid OTP')
            }

            // STEP 3: Create Firebase Account NOW
            const credential = await createUserWithEmailAndPassword(auth, otpEmail, password)
            const firebaseUser = credential.user
            await updateProfile(firebaseUser, { displayName: name })

            // Get fresh token
            const token = await firebaseUser.getIdToken(true)
            document.cookie = `urbanvista-token=${token}; path=/; max-age=86400; SameSite=Lax; Secure`

            // Sync user to db
            await fetch('/api/auth/sync-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ 
                    name, 
                    email: otpEmail,
                    phone: `+91${phone.replace(/\D/g, '')}`,
                    businessType,
                    emailVerified: true 
                })
            })

            switchScreen('success')
            setTimeout(() => { window.location.href = '/dashboard' }, 2000)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Verification failed')
        } finally {
            setLoading(false)
        }
    }

    const handleForgotSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!otpEmail) { setError('Email is required'); return }
        setLoading(true)
        setError('')
        try {
            await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: otpEmail })
            })
            switchScreen('forgot-otp')
            setSuccess('If this email is registered, a reset code was sent.')
        } catch {
            setError('Failed to send reset code')
        } finally {
            setLoading(false)
        }
    }

    const handleForgotVerifyOtp = async (otp: string) => {
        setLoading(true)
        setError('')
        try {
            // Check if OTP is valid
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: otpEmail, otp, type: 'PASSWORD_RESET' })
            })
            if (!res.ok) {
                const d = await res.json()
                throw new Error(d.error || 'Invalid OTP')
            }
            // Store verified OTP and move to new password screen
            setVerifiedOtp(otp)
            switchScreen('new-password')
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'OTP Verification failed')
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newPassword || newPassword.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: otpEmail, otp: verifiedOtp, newPassword })
            })
            if (!res.ok) {
                const d = await res.json()
                throw new Error(d.error || 'Reset failed')
            }
            
            switchScreen('signin')
            setSuccess('Password updated! Sign in.')
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Reset failed')
        } finally {
            setLoading(false)
        }
    }

    const leftPanel = (
        <div className="hidden md:flex flex-col justify-between w-[45%] bg-gradient-to-br from-slate-900 to-blue-950 p-12 text-white flex-shrink-0">
            <div>
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-sm">UV</div>
                    <span className="font-bold text-lg tracking-tight">UrbanVista</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
                    We Visit.<br />We Click.<br />We Show.
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    The only digital marketing agency that comes to your business location in Delhi NCR.
                </p>
                <div className="space-y-4">
                    {[
                        'Track your campaigns live in your dashboard',
                        'Get professional content delivered to your door',
                        'Grow your local business globally'
                    ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-blue-600/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                                <CheckCircle2 className="w-3 h-3 text-blue-400" />
                            </div>
                            <span className="text-slate-300 text-sm">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <p className="text-slate-500 text-xs mb-3 uppercase font-semibold tracking-wider">Trusted by 50+ local businesses</p>
                <div className="flex gap-2">
                    {['RK', 'PS', 'AG', 'MV', 'DR'].map((initials) => (
                        <div key={initials} className="w-9 h-9 rounded-full bg-slate-700/50 border-2 border-blue-800 flex items-center justify-center text-xs font-bold text-slate-300">
                            {initials}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    const formField = (
        label: string,
        type: string,
        value: string,
        onChange: (v: string) => void,
        icon: React.ReactNode,
        placeholder: string,
        extra?: React.ReactNode
    ) => (
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 placeholder-slate-400 text-sm transition-all"
                />
                {extra && <div className="absolute right-3 top-1/2 -translate-y-1/2">{extra}</div>}
            </div>
        </div>
    )

    const renderScreen = () => {
        if (screen === 'success') {
            return (
                <div className="flex flex-col items-center justify-center text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to UrbanVista! 🎉</h2>
                    <p className="text-slate-500">Your account is ready. Redirecting to dashboard...</p>
                    <div className="mt-6 w-12 h-1 bg-blue-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 animate-[grow_2.5s_linear_forwards]" />
                    </div>
                </div>
            )
        }

        if (screen === 'verify-email-otp') {
            return (
                <div>
                    <button onClick={() => switchScreen('signup')} className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-8 transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <div className="text-center mb-8">
                        <div className="text-4xl mb-3">📬</div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
                        <p className="text-slate-500 text-sm">
                            We sent a 6-digit code to<br />
                            <span className="text-blue-600 font-semibold">{otpEmail}</span>
                        </p>
                    </div>
                    {error && <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm text-center">{error}</div>}
                    {success && <div className="mb-4 p-3 rounded-xl bg-green-50 text-green-600 text-sm text-center">{success}</div>}
                    <OTPBoxes onComplete={handleVerifyEmailOTP} loading={loading} />
                    <div className="text-center mt-6">
                        {canResend ? (
                            <button onClick={handleResendOtp} className="text-blue-600 font-semibold text-sm hover:underline">
                                Resend Code
                            </button>
                        ) : (
                            <p className="text-slate-400 text-sm">Resend in 0:{String(countdown).padStart(2, '0')}</p>
                        )}
                    </div>
                    {loading && (
                        <div className="mt-6 flex justify-center">
                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>
            )
        }

        if (screen === 'forgot-email') {
            return (
                <form onSubmit={handleForgotSendOtp} className="space-y-5">
                    <button type="button" onClick={() => switchScreen('signin')} className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-2 transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Back to sign in
                    </button>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Forgot password?</h2>
                        <p className="text-slate-500 text-sm mt-1">Enter your email to receive a reset code.</p>
                    </div>
                    {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}
                    {success && <div className="p-3 rounded-xl bg-green-50 text-green-600 text-sm">{success}</div>}
                    {formField('Email Address', 'email', otpEmail, setOtpEmail, <Mail className="w-4 h-4" />, 'you@business.com')}
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Send Reset Code <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>
            )
        }

        if (screen === 'forgot-otp') {
            return (
                <div className="space-y-5">
                    <button type="button" onClick={() => switchScreen('forgot-email')} className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-2 transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <div className="text-center mb-6">
                        <div className="text-4xl mb-3">🔑</div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Enter reset code</h2>
                        <p className="text-slate-500 text-sm">Code sent to <span className="text-blue-600 font-semibold">{otpEmail}</span></p>
                    </div>
                    {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm text-center">{error}</div>}
                    {success && <div className="p-3 rounded-xl bg-green-50 text-green-600 text-sm text-center">{success}</div>}
                    <OTPBoxes onComplete={(otp) => handleForgotVerifyOtp(otp)} loading={loading} />
                    <div className="text-center mt-2">
                        {canResend ? (
                            <button onClick={handleResendOtp} className="text-blue-600 font-semibold text-sm hover:underline">Resend Code</button>
                        ) : (
                            <p className="text-slate-400 text-sm">Resend in 0:{String(countdown).padStart(2, '0')}</p>
                        )}
                    </div>
                </div>
            )
        }

        if (screen === 'new-password') {
            return (
                <form onSubmit={handleResetPassword} className="space-y-5">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Set New Password</h2>
                        <p className="text-slate-500 text-sm mt-1">Please enter your new password below.</p>
                    </div>
                    {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}
                    {formField('New Password', showPassword ? 'text' : 'password', newPassword, setNewPassword, <Lock className="w-4 h-4" />, 'Min. 8 characters',
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-600">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    )}
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2">
                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Update Password <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>
            )
        }

        if (screen === 'signup') {
            return (
                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
                        <p className="text-slate-500 text-sm mt-1">Start growing your business today</p>
                    </div>
                    {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}
                    {formField('Full Name', 'text', name, setName, <User className="w-4 h-4" />, 'Hritik Singh')}
                    {formField('Business Email', 'email', email, setEmail, <Mail className="w-4 h-4" />, 'you@business.com')}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                        <div className="flex gap-2">
                            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 flex items-center gap-1">
                                <Phone className="w-4 h-4 text-slate-400" /> +91
                            </div>
                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="9818xxxxxx" maxLength={10}
                                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Business Type</label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Building2 className="w-4 h-4" /></div>
                            <select value={businessType} onChange={e => setBusinessType(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-900 bg-white appearance-none">
                                <option value="">Select your business type</option>
                                {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    {formField('Password', showPassword ? 'text' : 'password', password, setPassword, <Lock className="w-4 h-4" />, 'Min. 8 characters',
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-600">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    )}
                    {formField('Confirm Password', showConfirmPassword ? 'text' : 'password', confirmPassword, setConfirmPassword, <Lock className="w-4 h-4" />, 'Re-enter password',
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-slate-400 hover:text-slate-600">
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    )}
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2">
                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
                    </button>
                    <p className="text-center text-sm text-slate-400">
                        Already have an account?{' '}
                        <button type="button" onClick={() => switchScreen('signin')} className="text-blue-600 font-semibold hover:underline">Sign in</button>
                    </p>
                </form>
            )
        }

        // signin (default)
        return (
            <form onSubmit={handleSignin} className="space-y-5">
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
                    <p className="text-slate-500 text-sm mt-1">Sign in to your UrbanVista account</p>
                </div>
                {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}
                {success && <div className="p-3 rounded-xl bg-green-50 text-green-600 text-sm">{success}</div>}
                {formField('Email Address', 'email', email, setEmail, <Mail className="w-4 h-4" />, 'you@business.com')}
                {formField('Password', showPassword ? 'text' : 'password', password, setPassword, <Lock className="w-4 h-4" />, 'Your password',
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
                <div className="text-right -mt-2">
                    <button type="button" onClick={() => { setOtpEmail(email); switchScreen('forgot-email') }} className="text-blue-600 text-sm font-medium hover:underline">
                        Forgot password?
                    </button>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3.5 transition-all flex items-center flex-col justify-center gap-1 disabled:opacity-70">
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {postLoginMessage && <span className="text-sm font-medium">{postLoginMessage}</span>}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            Sign In <ArrowRight className="w-4 h-4" />
                        </div>
                    )}
                </button>
                <p className="text-center text-sm text-slate-400">
                    New to UrbanVista?{' '}
                    <button type="button" onClick={() => switchScreen('signup')} className="text-blue-600 font-semibold hover:underline">Create an account</button>
                </p>
            </form>
        )
    }

    return (
        <div className="flex min-h-screen bg-[#f1f3f5]">
            {leftPanel}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md">
                    <div className="flex items-center gap-2 mb-8 md:hidden">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-xs">UV</div>
                        <span className="font-bold text-slate-900">UrbanVista</span>
                    </div>
                    {renderScreen()}
                </div>
            </div>
        </div>
    )
}
