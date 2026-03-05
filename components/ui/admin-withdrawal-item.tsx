"use client"

import { CheckCircle, XCircle, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateWithdrawalStatus } from "@/actions/withdrawal"
import { toast } from "sonner"
import { useState } from "react"

export function AdminWithdrawalItem({ withdrawal }: { withdrawal: any }) {
    const [isProcessing, setIsProcessing] = useState(false)

    const handleUpdate = async (status: 'COMPLETED' | 'REJECTED') => {
        setIsProcessing(true)
        const result = await updateWithdrawalStatus(withdrawal.id, status)
        if (result.success) {
            toast.success(`Withdrawal ${status.toLowerCase()} successfully`)
        } else {
            toast.error(result.error || "Failed to update withdrawal")
        }
        setIsProcessing(false)
    }

    return (
        <div className="flex items-center justify-between p-6">
            <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">
                            {withdrawal.user?.name || "Unknown User"}
                        </p>
                        <span className="text-muted-foreground text-xs">requests withdrawal of</span>
                        <p className="font-bold text-sm text-foreground">
                            ${withdrawal.amount.toFixed(2)}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            withdrawal.status === 'PENDING' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' :
                            withdrawal.status === 'COMPLETED' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                        }`}>
                            {withdrawal.status}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(withdrawal.createdAt).toLocaleDateString()} {new Date(withdrawal.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            </div>
            
            {withdrawal.status === 'PENDING' && (
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdate('COMPLETED')}
                        disabled={isProcessing}
                        className="text-green-600 border-green-600/20 hover:bg-green-600/10 hover:text-green-600 shrink-0 flex items-center justify-center"
                    >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdate('REJECTED')}
                        disabled={isProcessing}
                        className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive shrink-0 flex items-center justify-center"
                    >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                    </Button>
                </div>
            )}
        </div>
    )
}
