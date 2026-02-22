"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

export const ContactForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        businessType: 'Local Shop', // Corrected from the provided snippet
        businessDetails: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // await addUserQuery({
            //     name: formData.name,
            //     email: formData.email,
            //     message: `Phone: ${ formData.phone } \nType: ${ formData.businessType } \nDetails: ${ formData.businessDetails } `,
            // });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

            alert("Thank you! We will get back to you shortly.");
            setFormData({
                name: "",
                email: "",
                phone: "",
                businessDetails: "",
                businessType: "Local Shop",
            });
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/60 transition-all"
                        placeholder="Kunal"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/60 transition-all"
                        placeholder="kunal@example.com"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/60 transition-all"
                        placeholder="+91 9818xxxxxx"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="businessType" className="text-sm font-medium text-slate-700">Business Type</label>
                    <select
                        id="businessType"
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/60 transition-all text-slate-700"
                    >
                        <option value="Local Shop">Local Shop</option>
                        <option value="Barber">Barber</option>
                        <option value="Cafe">Cafe</option>
                        <option value="Restaurant">Restaurant</option>
                        <option value="Gym">Gym</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="businessDetails" className="text-sm font-medium text-slate-700">Business Details / Project Goals</label>
                <textarea
                    id="businessDetails"
                    name="businessDetails"
                    required
                    rows={5}
                    value={formData.businessDetails}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/60 transition-all resize-none"
                    placeholder="Tell us about your business and what you want to achieve..."
                />
            </div>

            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full py-4 text-lg font-medium shadow-lg shadow-blue-500/20 flex items-center justify-center">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
        </form>
    );
}
