import { useEffect, useState } from "react";
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
import { Lock, Loader2 } from "lucide-react";
import { useOrganizerBanks, useResolveOrganizerBankAccount } from "@/hooks/use-organizer-banks";
import type { BankAccount } from "@/types/settings";

interface AddBankAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (bankAccount: BankAccount) => void;
}

export function AddBankAccountDialog({
  open,
  onOpenChange,
  onSave,
}: AddBankAccountDialogProps) {
  const { data: banks = [] } = useOrganizerBanks(open);
  const resolveAccountMutation = useResolveOrganizerBankAccount();

  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [resolvedName, setResolvedName] = useState<string | null>(null);
  const [resolveError, setResolveError] = useState<string | null>(null);

  // Reset the form each time the dialog is reopened, rather than carrying
  // over a previous attempt's state.
  useEffect(() => {
    if (open) {
      setBankCode("");
      setAccountNumber("");
      setResolvedName(null);
      setResolveError(null);
    }
  }, [open]);

  // Verify the account with Paystack as soon as a full 10-digit account
  // number and a bank are both present — this is what actually confirms
  // the account is real, instead of trusting whatever name is typed in.
  useEffect(() => {
    if (accountNumber.length !== 10 || !bankCode) {
      setResolvedName(null);
      setResolveError(null);
      return;
    }

    let cancelled = false;
    setResolveError(null);

    resolveAccountMutation
      .mutateAsync({ accountNumber, bankCode })
      .then(({ accountName }) => {
        if (cancelled) return;
        setResolvedName(accountName);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setResolvedName(null);
        setResolveError(
          error instanceof Error ? error.message : "Could not verify this account number"
        );
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountNumber, bankCode]);

  const resolving = resolveAccountMutation.isPending;
  const selectedBank = banks.find((b) => b.code === bankCode);

  const handleContinue = () => {
    if (!resolvedName || !selectedBank) return;
    onSave({
      accountHolderName: resolvedName,
      bankName: selectedBank.name,
      bankCode: selectedBank.code,
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Bank</Label>
              <Select
                value={bankCode}
                onValueChange={(value) => value && setBankCode(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank.code} value={bank.code}>
                      {bank.name}
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

          <div>
            <Label htmlFor="accountHolderName">Account holder's name</Label>
            <Input
              id="accountHolderName"
              readOnly
              value={resolving ? "Verifying…" : (resolvedName ?? "")}
              placeholder="We'll fill this in once your account is verified"
              className="mt-1 bg-muted text-foreground"
            />
            {resolveError && (
              <p className="text-xs text-destructive mt-1">{resolveError}</p>
            )}
          </div>

          <div className="flex items-start gap-2 bg-[#E4F1EB] dark:bg-[#0F6E56]/15 rounded-lg p-3">
            <Lock className="size-4 text-[#0F6E56] dark:text-[#4ADE80] shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Bank details are encrypted and only used for payouts. Money lands
              a few days after each event.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <Button
            onClick={handleContinue}
            disabled={!resolvedName || resolving}
            className="bg-[#0F6E56] hover:bg-[#0F6E56]/90 text-white gap-1.5"
          >
            {resolving ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Verifying…
              </>
            ) : (
              "Continue →"
            )}
          </Button>

          <button
            onClick={handleSkip}
            className="text-sm font-medium text-muted-foreground hover:underline"
          >
            Skip for now
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
