'use client'
import { useState } from 'react'
import { auth } from '@/lib/firebase'
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { Shield, Lock, AlertTriangle } from 'lucide-react'

export default function SecurityPage() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return }
        if (newPassword !== confirmPassword) { setError('Passwords do not match'); return }

        setSaving(true)
        try {
            const currentUser = auth.currentUser
            if (!currentUser || !currentUser.email) throw new Error('Not authenticated')

            const credential = EmailAuthProvider.credential(currentUser.email, currentPassword)
            await reauthenticateWithCredential(currentUser, credential)
            await updatePassword(currentUser, newPassword)

            setSuccess('Password changed successfully!')
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (err: unknown) {
            const { FirebaseError } = await import('firebase/app')
            if (err instanceof FirebaseError) {
                const msgs: Record<string, string> = {
                    'auth/wrong-password': 'Current password is incorrect.',
                    'auth/too-many-requests': 'Too many attempts. Try later.',
                    'auth/requires-recent-login': 'Please sign out and sign back in first.'
                }
                setError(msgs[err.code] || err.message)
            } else {
                setError(err instanceof Error ? err.message : 'Failed to change password')
            }
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="p-8 max-w-2xl space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Security & Privacy</h1>

            {/* Change Password */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900">Change Password</h2>
                        <p className="text-sm text-slate-500">Keep your account secure</p>
                    </div>
                </div>
                {error && <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}
                {success && <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm">{success}</div>}
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Current Password</label>
                        <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">New Password</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="8+ characters"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Confirm New Password</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none" />
                    </div>
                    <button type="submit" disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all disabled:opacity-70">
                        {saving ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>

            {/* Security Status */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900">Security Status</h2>
                        <p className="text-sm text-slate-500">Your account protection level</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-slate-50">
                        <div>
                            <p className="font-semibold text-slate-900 text-sm">Two-Factor Authentication</p>
                            <p className="text-xs text-slate-500">Extra protection for your account</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">Not enabled</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-slate-50">
                        <div>
                            <p className="font-semibold text-slate-900 text-sm">Email Verification</p>
                            <p className="text-xs text-slate-500">Your email is verified</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">✓ Active</span>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 border border-red-100 p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h2 className="font-bold text-red-700">Danger Zone</h2>
                </div>
                <p className="text-sm text-red-600 mb-4">Deleting your account is permanent and cannot be undone. All your data will be permanently removed.</p>
                <button className="text-sm text-red-600 border border-red-300 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors font-medium">
                    Delete Account
                </button>
            </div>
        </div>
    )
}
