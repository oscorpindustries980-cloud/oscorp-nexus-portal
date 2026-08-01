import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type QuotationStatus = "Submitted" | "Under Review" | "Approved" | "Rejected";
export type Department = "Genetics" | "Robotics" | "Aerospace" | "HR";

export interface Quotation {
  id: string;
  client: string;
  email: string;
  title: string;
  department: Department;
  budget: number;
  approvedPrice?: number;
  adminNotes?: string;
  notes: string;
  fileName: string;
  date: string;
  status: QuotationStatus;
}

export interface PortalUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "Admin" | "Vendor" | "Client";
  joined: string;
  status: "Active" | "Blocked";
  blockReason?: string;
}

export interface Employee {
  ref: string;
  name: string;
  title: string;
  division: Department;
  verified: boolean;
  dispatch: "Dispatched" | "Queued" | "Awaiting Signature";
}

export const ADMIN_EMAIL = "admin@oscorp.com";
export const ADMIN_PASSWORD = "Admin2026!";

const today = "2026-08-01";

const seedQuotations: Quotation[] = [
  {
    id: "OSC-QT-90821",
    client: "Shreya Kumari",
    email: "shreya.kumari@oscorp.com",
    title: "Genome Sequencing Cluster Expansion",
    department: "Genetics",
    budget: 480000,
    notes: "Phase II expansion of the Queens sequencing lab with cold-chain logistics.",
    fileName: "genetics-cluster-proposal.pdf",
    date: "2026-07-12",
    status: "Under Review",
  },
  {
    id: "OSC-QT-90822",
    client: "Angel Tripathi",
    email: "angeltripathi.2802@gmail.com",
    title: "Autonomous Warehouse Robotics Retrofit",
    department: "Robotics",
    budget: 1250000,
    notes: "Retrofit of 42 AGV units with Oscorp Mark-IV control stacks.",
    fileName: "robotics-retrofit-scope.docx",
    date: "2026-07-19",
    status: "Approved",
    approvedPrice: 1180000,
    adminNotes: "Approved with 5.6% value engineering on the control stacks.",
  },
  {
    id: "OSC-QT-90823",
    client: "Marcus Vale",
    email: "m.vale@valedynamics.io",
    title: "Orbital Payload Integration Services",
    department: "Aerospace",
    budget: 3400000,
    notes: "Integration support for the Helios-3 payload bay.",
    fileName: "aerospace-payload.zip",
    date: "2026-07-24",
    status: "Submitted",
  },
  {
    id: "OSC-QT-90824",
    client: "Nadia Okafor",
    email: "n.okafor@brightpath-hr.com",
    title: "Global Talent Compliance Audit",
    department: "HR",
    budget: 96000,
    notes: "Compliance audit across 14 jurisdictions for contract personnel.",
    fileName: "hr-compliance-audit.pdf",
    date: "2026-07-28",
    status: "Rejected",
    adminNotes: "Scope overlaps an existing framework agreement.",
  },
];

const seedUsers: PortalUser[] = [
  {
    id: "USR-001",
    name: "Oscorp Administrator",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "Admin",
    joined: "2024-01-08",
    status: "Active",
  },
  {
    id: "USR-002",
    name: "Shreya Kumari",
    email: "shreya.kumari@oscorp.com",
    password: "Vendor2026!",
    role: "Vendor",
    joined: "2025-03-14",
    status: "Active",
  },
  {
    id: "USR-003",
    name: "Angel Tripathi",
    email: "angeltripathi.2802@gmail.com",
    password: "Vendor2026!",
    role: "Client",
    joined: "2025-09-02",
    status: "Active",
  },
  {
    id: "USR-004",
    name: "Marcus Vale",
    email: "m.vale@valedynamics.io",
    password: "Vendor2026!",
    role: "Vendor",
    joined: "2026-01-21",
    status: "Blocked",
    blockReason: "Unverified Documents",
  },
  {
    id: "USR-005",
    name: "Nadia Okafor",
    email: "n.okafor@brightpath-hr.com",
    password: "Vendor2026!",
    role: "Client",
    joined: "2026-04-30",
    status: "Active",
  },
];

export const employees: Employee[] = [
  {
    ref: "OSC-IN-90821",
    name: "Shreya Kumari",
    title: "Quotation Specialist",
    division: "HR",
    verified: true,
    dispatch: "Dispatched",
  },
  {
    ref: "OSC-IN-90822",
    name: "Dr. Miles Warren",
    title: "Principal Geneticist",
    division: "Genetics",
    verified: true,
    dispatch: "Dispatched",
  },
  {
    ref: "OSC-IN-90833",
    name: "Elena Straub",
    title: "Robotics Program Director",
    division: "Robotics",
    verified: true,
    dispatch: "Awaiting Signature",
  },
  {
    ref: "OSC-IN-90844",
    name: "Kwame Adjei",
    title: "Aerospace Systems Lead",
    division: "Aerospace",
    verified: false,
    dispatch: "Queued",
  },
  {
    ref: "OSC-IN-90855",
    name: "Priya Raghavan",
    title: "Contract Compliance Officer",
    division: "HR",
    verified: true,
    dispatch: "Dispatched",
  },
  {
    ref: "OSC-IN-90866",
    name: "Tomas Lindqvist",
    title: "Senior Procurement Analyst",
    division: "Robotics",
    verified: true,
    dispatch: "Queued",
  },
];

interface PortalContextValue {
  user: PortalUser | null;
  users: PortalUser[];
  quotations: Quotation[];
  isAdmin: boolean;
  isBlocked: boolean;
  suspensionVisible: boolean;
  flagSuspension: () => void;
  dismissSuspension: () => void;
  login: (email: string, password: string) => { ok: boolean; message: string };
  register: (name: string, email: string, password: string) => { ok: boolean; message: string };
  logout: () => void;
  submitQuotation: (input: {
    client: string;
    email: string;
    title: string;
    department: Department;
    budget: number;
    notes: string;
    fileName: string;
  }) => string;
  approveQuotation: (id: string, price: number, notes: string) => void;
  rejectQuotation: (id: string, notes?: string) => void;
  setQuotationStatus: (id: string, status: QuotationStatus) => void;
  blockUser: (id: string, reason: string) => void;
  unblockUser: (id: string) => void;
}

const PortalContext = createContext<PortalContextValue | null>(null);

export function PortalProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<PortalUser[]>(seedUsers);
  const [quotations, setQuotations] = useState<Quotation[]>(seedQuotations);
  const [userId, setUserId] = useState<string | null>(null);
  const [suspensionVisible, setSuspensionVisible] = useState(false);

  const user = useMemo(() => users.find((u) => u.id === userId) ?? null, [users, userId]);

  const login = useCallback(
    (email: string, password: string) => {
      const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!found || found.password !== password) {
        return { ok: false, message: "Invalid credentials. Please try again." };
      }
      setUserId(found.id);
      if (found.status === "Blocked") setSuspensionVisible(true);
      return {
        ok: true,
        message:
          found.role === "Admin"
            ? "Admin Control Panel unlocked."
            : `Welcome back, ${found.name}.`,
      };
    },
    [users],
  );

  const register = useCallback(
    (name: string, email: string, password: string) => {
      if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
        return { ok: false, message: "An account with this email already exists." };
      }
      const newUser: PortalUser = {
        id: `USR-${String(users.length + 1).padStart(3, "0")}`,
        name,
        email: email.trim(),
        password,
        role: "Vendor",
        joined: today,
        status: "Active",
      };
      setUsers((prev) => [...prev, newUser]);
      setUserId(newUser.id);
      return { ok: true, message: `Account created — welcome to Oscorp, ${name}.` };
    },
    [users],
  );

  const logout = useCallback(() => {
    setUserId(null);
    setSuspensionVisible(false);
  }, []);

  const submitQuotation: PortalContextValue["submitQuotation"] = useCallback((input) => {
    const id = `OSC-2026-${Math.random().toString(36).slice(2, 4).toUpperCase()}${Math.floor(
      Math.random() * 90 + 10,
    )}`;
    setQuotations((prev) => [
      { ...input, id, date: today, status: "Submitted" as QuotationStatus },
      ...prev,
    ]);
    return id;
  }, []);

  const approveQuotation = useCallback((id: string, price: number, notes: string) => {
    setQuotations((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, status: "Approved", approvedPrice: price, adminNotes: notes } : q,
      ),
    );
  }, []);

  const rejectQuotation = useCallback((id: string, notes?: string) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "Rejected", adminNotes: notes } : q)),
    );
  }, []);

  const setQuotationStatus = useCallback((id: string, status: QuotationStatus) => {
    setQuotations((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
  }, []);

  const blockUser = useCallback((id: string, reason: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "Blocked", blockReason: reason } : u)),
    );
  }, []);

  const unblockUser = useCallback((id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "Active", blockReason: undefined } : u)),
    );
  }, []);

  const value: PortalContextValue = {
    user,
    users,
    quotations,
    isAdmin: user?.role === "Admin",
    isBlocked: user?.status === "Blocked",
    suspensionVisible: suspensionVisible && user?.status === "Blocked",
    flagSuspension: () => setSuspensionVisible(true),
    dismissSuspension: () => setSuspensionVisible(false),
    login,
    register,
    logout,
    submitQuotation,
    approveQuotation,
    rejectQuotation,
    setQuotationStatus,
    blockUser,
    unblockUser,
  };

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error("usePortal must be used within PortalProvider");
  return ctx;
}

export const currency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
