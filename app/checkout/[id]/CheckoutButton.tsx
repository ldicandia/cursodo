'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

export default function CheckoutButton({ courseId, price }: { courseId: string; price: number }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || 'Something went wrong');
            }
        } catch (error) {
            console.error(error);
            alert('Error creating checkout session');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-6 border-t flex flex-col gap-4">
            <div className="flex items-center justify-between text-lg font-bold">
                <span>Total to Pay</span>
                <span>${price.toFixed(2)}</span>
            </div>

            <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 rounded-xl shadow-lg shadow-action/25 font-bold text-lg text-white bg-action hover:bg-action/90 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Processing...' : `Pay $${price.toFixed(2)} & Enroll`}
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Your payment is secure and encrypted
            </div>
        </div>
    );
}
