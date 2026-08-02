import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, LogIn, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ADMIN_EMAIL, ADMIN_PASSWORD, usePortal } from "@/lib/portal-store";

export function AuthDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { login, register } = usePortal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-accent" />
            Oscorp Secure Portal Access
          </DialogTitle>
          <DialogDescription>
            Authenticate to submit quotations, track contracts, or open the Admin Control Panel.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign in</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <Label htmlFor="login-email">Work email</Label>
              <Input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button
              className="w-full"
              onClick={() => {
                const res = login(email, password);
                if (res.ok) {
                  toast.success(res.message);
                  onOpenChange(false);
                } else {
                  toast.error(res.message);
                }
              }}
            >
              <LogIn className="size-4" /> Sign in
            </Button>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                className="rounded-md border border-dashed border-accent/40 bg-accent/5 p-3 text-left text-xs text-muted-foreground transition-colors hover:bg-accent/10"
                onClick={() => {
                  setEmail(ADMIN_EMAIL);
                  setPassword(ADMIN_PASSWORD);
                }}
              >
                <span className="font-semibold text-accent">Admin access</span>
                <br />
                {ADMIN_EMAIL} / {ADMIN_PASSWORD}
              </button>
              <button
                type="button"
                className="rounded-md border border-dashed border-accent/40 bg-accent/5 p-3 text-left text-xs text-muted-foreground transition-colors hover:bg-accent/10"
                onClick={() => {
                  setEmail(CLIENT_EMAIL);
                  setPassword(CLIENT_PASSWORD);
                }}
              >
                <span className="font-semibold text-accent">Your account</span>
                <br />
                {CLIENT_EMAIL} / {CLIENT_PASSWORD}
              </button>
            </div>
          </TabsContent>

          <TabsContent value="register" className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <Label htmlFor="reg-name">Full name</Label>
              <Input id="reg-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-email">Work email</Label>
              <Input
                id="reg-email"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-password">Password</Label>
              <Input
                id="reg-password"
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              onClick={() => {
                if (!name.trim() || !regEmail.trim() || regPassword.length < 6) {
                  toast.error("Enter a name, email and a password of at least 6 characters.");
                  return;
                }
                const res = register(name.trim(), regEmail, regPassword);
                if (res.ok) {
                  toast.success(res.message);
                  onOpenChange(false);
                } else {
                  toast.error(res.message);
                }
              }}
            >
              <UserPlus className="size-4" /> Create vendor account
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
