import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lock } from "lucide-react";
import { banks } from "@/lib/dummy-banks";
import type { BankAccount } from "@/types/settings";

interface AddBankAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (bankAccount: BankAccount) => void;
  defaultAccountHolderName: string;
}

export function AddBankAccountDialog({
  open,
  onOpenChange,
  onSave,
  defaultAccountHolderName,
}: AddBankAccountDialogProps) {
  const [accountHolderName, setAccountHolderName] = useState(
    defaultAccountHolderName,
  );
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const handleContinue = () => {
    onSave({
      accountHolderName,
      bankName,
      accountNumber,
    });
    onOpenChange(false);
  };

  const handleSkip = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Set up your payout account </DialogTitle>
          <DialogDescription>
            Connect your bank account to get paid. We'll securely verify your
            details with Paystack.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="accountHolderName">Account holder's name</Label>
            <Input
              id="accountHolderName"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Bank</Label>
              <Select
                value={bankName}
                onValueChange={(value) => value && setBankName(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="accountNumber">Account number</Label>
              <Input
                id="accountNumber"
                placeholder="10 digit number"
                maxLength={10}
                value={accountNumber}
                onChange={(e) => {
                  const digitsOnly = e.target.value.replace(/\D/g, "");
                  setAccountNumber(digitsOnly);
                }}
              />
            </div>
          </div>

          <div className="flex items-start gap-2 bg-[#E4F1EB] rounded-lg p-3">
            <Lock className="size-4 text-[#0F6E56] shrink-0 mt-0.5" />
            <p className="text-xs text-[#4A4451]">
              Bank details are encrypted and only used for payouts. Money lands
              a few days after each event.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <Button
            onClick={handleContinue}
            disabled={!accountHolderName || !bankName || accountNumber.length !== 10}
            className="bg-[#0F6E56] hover:bg-[#0F6E56]/90 text-white gap-1.5"
          >
            Continue →
          </Button>

          <button
            onClick={handleSkip}
            className="text-sm font-medium text-[#4A4451] hover:underline"
          >
            Skip for now
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
