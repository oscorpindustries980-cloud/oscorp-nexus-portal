import { useState, type DragEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, FileUp, IdCard, Paperclip, Send, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { employees, usePortal, type Department } from "@/lib/portal-store";

export const Route = createFileRoute("/employee")({
  head: () => ({
    meta: [
      { title: "Employee Quotation Upload Desk — Oscorp Industries" },
      {
        name: "description",
        content:
          "Internal desk for Oscorp personnel to upload vendor quotations and supporting documents to the contracts registry.",
      },
      { property: "og:title", content: "Employee Quotation Upload Desk — Oscorp Industries" },
      {
        property: "og:description",
        content:
          "Upload quotation files against your employee reference ID and receive an internal lodgement receipt.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmployeeUploadPage,
});

const departments: Department[] = [
  "Heavy Machinery",
  "Industrial Automation",
  "Power & Energy",
  "HR",
];

function EmployeeUploadPage() {
  const { submitQuotation, isBlocked, flagSuspension } = usePortal();
  const [ref, setRef] = useState("");
  const [name, setName] = useState("");
  const [division, setDivision] = useState<Department>("Heavy Machinery");
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [receipts, setReceipts] = useState<{ id: string; file: string; at: string }[]>([]);

  const attach = (f: File | undefined) => {
    if (!f) return;
    setFileName(f.name);
    toast.success(`${f.name} attached for lodgement.`);
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    attach(e.dataTransfer.files?.[0]);
  };

  const lookup = (value: string) => {
    setRef(value);
    const match = employees.find((e) => e.ref.toLowerCase() === value.trim().toLowerCase());
    if (match) {
      setName(match.name);
      setDivision(match.division);
      toast.success(`Personnel verified — ${match.name}, ${match.title}.`);
    }
  };

  const submit = () => {
    if (isBlocked) {
      flagSuspension();
      toast.error("Your account has been suspended by Oscorp Admin.");
      return;
    }
    if (!ref.trim() || !name.trim() || !title.trim() || !fileName) {
      toast.error("Enter your reference ID, name, document title and attach a file.");
      return;
    }
    const id = submitQuotation({
      client: name.trim(),
      email: `${ref.trim().toLowerCase()}@oscorp.com`,
      title: title.trim(),
      department: division,
      budget: Number(value) || 0,
      notes: notes.trim(),
      fileName,
    });
    setReceipts((prev) => [
      { id, file: fileName, at: new Date().toLocaleString("en-GB") },
      ...prev,
    ]);
    toast.success(`Document lodged — receipt ${id}`, {
      description: "Forwarded to the contracts desk for internal processing.",
    });
    setTitle("");
    setValue("");
    setNotes("");
    setFileName("");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/8 px-3 py-1 text-xs font-medium text-accent">
        <IdCard className="size-3.5" /> Internal personnel desk
      </div>
      <h1 className="mt-4 text-3xl font-semibold text-primary">Employee Quotation Upload Desk</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Lodge vendor quotations and supporting documents against your Oscorp personnel reference.
        Uploads are routed to the contracts desk — decisions are communicated offline by the
        procurement office, not on this screen.
      </p>

      <Card className="mt-8 glass-card">
        <CardHeader>
          <CardTitle className="text-base">Document lodgement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="emp-ref">Employee reference ID</Label>
              <Input
                id="emp-ref"
                value={ref}
                onChange={(e) => lookup(e.target.value)}
                placeholder="OSC-IN-90821"
                className="font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emp-name">Full name</Label>
              <Input id="emp-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Division</Label>
              <Select value={division} onValueChange={(v) => setDivision(v as Department)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emp-value">Quoted value (USD, optional)</Label>
              <Input
                id="emp-value"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="185000"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="emp-title">Document title</Label>
            <Input
              id="emp-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Vendor quotation — hydraulic press spares"
            />
          </div>

          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/50 px-6 py-10 text-center transition-colors",
              dragging && "border-accent bg-accent/8",
            )}
          >
            <FileUp className="size-7 text-accent" />
            <p className="mt-3 text-sm font-medium text-primary">
              Drag & drop the quotation file, or click to browse
            </p>
            <p className="mt-1 text-xs text-muted-foreground">PDF, DOCX or ZIP · max 50 MB</p>
            <input
              type="file"
              accept=".pdf,.docx,.zip"
              className="hidden"
              onChange={(e) => attach(e.target.files?.[0])}
            />
            {fileName && (
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-background px-3 py-1 text-xs font-medium text-accent">
                <Paperclip className="size-3" /> {fileName}
              </span>
            )}
          </label>

          <div className="space-y-1.5">
            <Label htmlFor="emp-notes">Handover notes</Label>
            <Textarea
              id="emp-notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Plant, cost centre, vendor name, urgency…"
            />
          </div>

          <Button size="lg" onClick={submit}>
            <Send className="size-4" /> Lodge document
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6 glass-card">
        <CardHeader>
          <CardTitle className="text-base">Lodgement receipts (this session)</CardTitle>
        </CardHeader>
        <CardContent>
          {receipts.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Upload className="size-4" /> No documents lodged yet in this session.
            </p>
          ) : (
            <ul className="space-y-3">
              {receipts.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-secondary/60 p-3"
                >
                  <BadgeCheck className="size-4 text-accent" />
                  <span className="font-mono text-sm font-semibold text-primary">{r.id}</span>
                  <span className="text-sm text-foreground">{r.file}</span>
                  <span className="ml-auto text-xs text-muted-foreground">Lodged {r.at}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-muted-foreground">
            Approval outcomes are not published on this desk. The procurement office issues the
            formal decision letter to your division inbox.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
