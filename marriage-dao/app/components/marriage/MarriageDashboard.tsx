/**
 * Marriage Dashboard Component
 * Displays marriage information when user is bonded
 * Shows partner, TIME tokens, and divorce option
 */

"use client";

import { useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import { CONTRACT_ADDRESSES, HUMAN_BOND_ABI } from "@/lib/contracts";
import { useAuthStore } from "@/state/authStore";
import { UserDashboard } from "@/lib/worldcoin/useUserDashboard";

type DivorceState = "idle" | "sending" | "success" | "error";

interface MarriageDashboardProps {
    dashboard: UserDashboard;
    onDivorce?: () => void; // Callback to refresh dashboard after divorce
}

export function MarriageDashboard({ dashboard, onDivorce }: MarriageDashboardProps) {
    const { walletAddress } = useAuthStore();
    const [divorceState, setDivorceState] = useState<DivorceState>("idle");
    const [error, setError] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDivorce = async () => {
        if (!dashboard.partner || !walletAddress) {
            setError("Missing partner or wallet information");
            return;
        }

        try {
            setDivorceState("sending");
            setError(null);

            const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
                transaction: [
                    {
                        address: CONTRACT_ADDRESSES.HUMAN_BOND,
                        abi: HUMAN_BOND_ABI,
                        functionName: "divorce",
                        args: [dashboard.partner],
                    },
                ],
            });

            if (finalPayload.status === "error") {
                throw new Error("Divorce transaction failed");
            }

            setDivorceState("success");
            setShowConfirm(false);

            // Call callback to refresh dashboard
            if (onDivorce) {
                onDivorce();
            }
        } catch (err) {
            setDivorceState("error");
            setError(err instanceof Error ? err.message : "Failed to divorce");
        }
    };

    // Format TIME token balance (from wei to whole tokens)
    const timeBalance = Number(dashboard.timeBalance) / 1e18;
    const pendingYield = Number(dashboard.pendingYield) / 1e18;

    return (
        <div className="w-full max-w-2xl space-y-6">
            {/* Marriage Status Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg space-y-6">
                {/* Title */}
                <div className="text-center space-y-2">
                    <h2 className="text-4xl font-bold text-black">💒</h2>
                    <h3 className="text-2xl font-medium text-black">You are Married!</h3>
                </div>

                {/* Partner Info */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <span className="text-sm text-gray-600 font-medium">Partner</span>
                        <span className="text-sm font-mono text-black">
                            {dashboard.partner.slice(0, 6)}...{dashboard.partner.slice(-4)}
                        </span>
                    </div>

                    {/* TIME Token Balance */}
                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl">
                        <span className="text-sm text-gray-600 font-medium">TIME Balance</span>
                        <div className="text-right">
                            <p className="text-lg font-bold text-amber-900">{timeBalance.toFixed(2)} DAY</p>
                            {pendingYield > 0 && (
                                <p className="text-xs text-amber-700">
                                    +{pendingYield.toFixed(2)} pending
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Divorce Section */}
                <div className="pt-4 border-t border-gray-200">
                    {!showConfirm ? (
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="w-full py-3 px-6 rounded-full text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                        >
                            End Marriage
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-sm text-center text-gray-700">
                                Are you sure? Pending TIME tokens will be distributed.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 py-3 px-6 rounded-full text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                                    disabled={divorceState === "sending"}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDivorce}
                                    className="flex-1 py-3 px-6 rounded-full text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
                                    disabled={divorceState === "sending"}
                                >
                                    {divorceState === "sending" ? "Processing..." : "Confirm Divorce"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Success/Error Messages */}
                {divorceState === "success" && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
                        <p className="text-sm text-green-800 text-center">
                            Marriage dissolved. Pending tokens distributed.
                        </p>
                    </div>
                )}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                        <p className="text-sm text-red-800 text-center">{error}</p>
                    </div>
                )}
            </div>

            {/* Additional Info Card */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Marriage Benefits</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                        <span>🪙</span>
                        <span>Earn 1 TIME token per day together</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span>🎨</span>
                        <span>Both received unique Vow NFTs</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span>🏆</span>
                        <span>Unlock milestone NFTs on anniversaries</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
