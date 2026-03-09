import Link from 'next/link';
import { CreditCard, ShieldCheck } from 'lucide-react';

export default function CheckoutPage({ params }: { params: { id: string } }) {
    return (
        <div className="container mx-auto px-4 py-16 max-w-3xl">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold mb-4">Complete your Enrollment</h1>
                <p className="text-muted-foreground text-lg">Secure your spot in the masterclass</p>
            </div>

            <div className="bg-card border rounded-3xl p-8 shadow-sm">
                <div className="mb-8 p-4 bg-muted/50 rounded-2xl flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-2xl">🦷</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground">Advanced Endodontics Masterclass: Rotary Instruments</h3>
                        <p className="text-muted-foreground">Dr. Elena Smith • $499.00</p>
                    </div>
                </div>

                <form className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Payment Details</h3>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Name on Card
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Card Number
                            </label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                                    placeholder="0000 0000 0000 0000"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Expiry Date
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                                    placeholder="MM/YY"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    CVC
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                                    placeholder="123"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t flex flex-col gap-4">
                        <div className="flex items-center justify-between text-lg font-bold">
                            <span>Total to Pay</span>
                            <span>$499.00</span>
                        </div>

                        <Link
                            href="/dashboard/student"
                            className="w-full flex justify-center py-4 px-4 rounded-xl shadow-lg shadow-primary/25 font-bold text-lg text-white bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            Pay ${499} & Enroll
                        </Link>

                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
                            <ShieldCheck className="w-4 h-4 text-green-500" />
                            Your payment is secure and encrypted
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
