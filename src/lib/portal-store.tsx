import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type QuotationStatus = "Submitted" | "Under Review" | "Approved" | "Rejected";
export type Department = "Heavy Machinery" | "Industrial Automation" | "Power & Energy" | "HR";

export interface Quotation {
  id: string;
  client: string;
  email: string;
  title: string;
  department: Department;
  budget: number;
  approvedPrice?: number | undefined;
  adminNotes?: string | undefined;
  notes: string;
  fileName: string;
  date: string;
  status: QuotationStatus;
  /** Personnel reference ID of the Oscorp employee who lodged / owns the file. */
  ownerRef?: string | undefined;
}

export interface PortalUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "Admin" | "HR" | "Vendor" | "Client";
  joined: string;
  status: "Active" | "Blocked";
  blockReason?: string | undefined;
  /** Links an admin console account to its HR personnel record. */
  employeeRef?: string | undefined;
}


export interface Employee {
  ref: string;
  name: string;
  title: string;
  division: Department;
  verified: boolean;
  dispatch: "Dispatched" | "Queued" | "Awaiting Signature";
  email: string;
  grade: string;
  location: string;
  joined: string;
}

/** Personnel passcode rule issued by Oscorp IT on onboarding. */
export function employeePasscode(ref: string) {
  return `Oscorp@${ref.trim().slice(-5)}`;
}

export const ADMIN_EMAIL = "admin@oscorp.com";
export const ADMIN_PASSWORD = "Admin2026!";
export const CLIENT_EMAIL = "i.malhotra@oscorp.com";
export const CLIENT_PASSWORD = "Contracts@2026";
/** Contracts head HR personnel record — the linked admin console account. */
export const CONTRACTS_HEAD_REF = "OSC-IN-90802";
/** Approvals desk admin — Zishu Ahmad. */
export const ZISHU_EMAIL = "z.ahmad@oscorp.com";
export const ZISHU_PASSWORD = "Zishu@2026";
export const ZISHU_REF = "OSC-IN-90877";


const today = "2026-08-01";

const seedQuotations: Quotation[] = [
  {
    id: "OSC-QT-90821",
    client: "Shreya Kumari",
    email: "shreya.kumari@oscorp.com",
    title: "CNC Machining Line Expansion — Plant 04",
    department: "Heavy Machinery",
    budget: 480000,
    notes: "Phase II expansion of the Queens fabrication plant with heavy-haul logistics.",
    fileName: "machining-line-proposal.pdf",
    date: "2026-07-12",
    status: "Under Review",
    ownerRef: "OSC-IN-90821",
  },
  {
    id: "OSC-QT-90822",
    client: "Ishaan Malhotra",
    email: CLIENT_EMAIL,
    title: "Conveyor & PLC Automation Retrofit",
    department: "Industrial Automation",
    budget: 1250000,
    notes: "Retrofit of 42 conveyor lines with Oscorp Mark-IV PLC control panels.",
    fileName: "automation-retrofit-scope.docx",
    date: "2026-07-19",
    status: "Approved",
    approvedPrice: 1180000,
    adminNotes: "Approved with 5.6% value engineering on the control panels.",
    ownerRef: CONTRACTS_HEAD_REF,
  },
  {
    id: "OSC-QT-90831",
    client: "Ishaan Malhotra",
    email: CLIENT_EMAIL,
    title: "Hydraulic Press Spares — Annual Rate Contract",
    department: "Heavy Machinery",
    budget: 615000,
    notes: "Two-year rate contract for 200T/400T press spares across Plant 02 and Plant 04.",
    fileName: "press-spares-rate-contract.pdf",
    date: "2026-07-22",
    status: "Under Review",
    ownerRef: CONTRACTS_HEAD_REF,
  },
  {
    id: "OSC-QT-90838",
    client: "Ishaan Malhotra",
    email: CLIENT_EMAIL,
    title: "Substation 11kV Upgrade — Helios Yard",
    department: "Power & Energy",
    budget: 2140000,
    notes: "Switchgear replacement, protection relays and SCADA tie-in for the Helios yard.",
    fileName: "substation-upgrade-boq.zip",
    date: "2026-07-30",
    status: "Submitted",
    ownerRef: CONTRACTS_HEAD_REF,
  },
  {
    id: "OSC-QT-90823",
    client: "Marcus Vale",
    email: "m.vale@valedynamics.io",
    title: "Turbine Overhaul & Boiler Integration",
    department: "Power & Energy",
    budget: 3400000,
    notes: "Overhaul support for the Helios-3 turbine hall and boiler feed systems.",
    fileName: "turbine-overhaul-scope.zip",
    date: "2026-07-24",
    status: "Submitted",
    ownerRef: "OSC-IN-90844",
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
    ownerRef: "OSC-IN-90855",
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
    email: HR_EMAIL,
    password: HR_PASSWORD,
    role: "HR",
    joined: "2023-06-12",
    status: "Active",
    employeeRef: HR_REF,
  },
  {
    id: "USR-003",
    name: "Ishaan Malhotra",
    email: CLIENT_EMAIL,
    password: CLIENT_PASSWORD,
    role: "Admin",
    joined: "2025-09-02",
    status: "Active",
    employeeRef: CONTRACTS_HEAD_REF,
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
  {
    id: "USR-006",
    name: "Zishu Ahmad",
    email: ZISHU_EMAIL,
    password: ZISHU_PASSWORD,
    role: "Admin",
    joined: "2025-11-11",
    status: "Active",
    employeeRef: ZISHU_REF,
  },
];

const seedEmployees: Employee[] = [
  {
    ref: CONTRACTS_HEAD_REF,
    email: CLIENT_EMAIL,
    grade: "G-10 · Contracts & Procurement",
    location: "Corporate HQ, NY · Plant 02 liaison",
    joined: "2025-09-02",
    name: "Ishaan Malhotra",
    title: "Head of Quotations & Contract Administration",
    division: "Industrial Automation",
    verified: true,
    dispatch: "Dispatched",
  },
  {

    ref: HR_REF,
    email: HR_EMAIL,
    grade: "G-7 · Contracts",
    location: "Queens Plant 04, NY",
    joined: "2023-06-12",
    name: "Shreya Kumari",
    title: "Quotation Specialist",
    division: "HR",
    verified: true,
    dispatch: "Dispatched",
  },
  {
    ref: "OSC-IN-90822",
    email: "m.warren@oscorp.com",
    grade: "G-9 · Engineering",
    location: "Fabrication Works, NJ",
    joined: "2019-02-04",
    name: "Dr. Miles Warren",
    title: "Principal Plant Engineer",
    division: "Heavy Machinery",
    verified: true,
    dispatch: "Dispatched",
  },
  {
    ref: "OSC-IN-90833",
    email: "e.straub@oscorp.com",
    grade: "G-8 · Automation",
    location: "Control Systems Hub, MI",
    joined: "2021-10-18",
    name: "Elena Straub",
    title: "Automation Program Director",
    division: "Industrial Automation",
    verified: true,
    dispatch: "Awaiting Signature",
  },
  {
    ref: "OSC-IN-90844",
    email: "k.adjei@oscorp.com",
    grade: "G-8 · Power Systems",
    location: "Helios-3 Turbine Hall, TX",
    joined: "2022-04-25",
    name: "Kwame Adjei",
    title: "Power Systems Lead",
    division: "Power & Energy",
    verified: false,
    dispatch: "Queued",
  },
  {
    ref: "OSC-IN-90855",
    email: "p.raghavan@oscorp.com",
    grade: "G-7 · Compliance",
    location: "Corporate HQ, NY",
    joined: "2020-08-03",
    name: "Priya Raghavan",
    title: "Contract Compliance Officer",
    division: "HR",
    verified: true,
    dispatch: "Dispatched",
  },
  {
    ref: "OSC-IN-90866",
    email: "t.lindqvist@oscorp.com",
    grade: "G-6 · Procurement",
    location: "Central Procurement, IL",
    joined: "2024-01-15",
    name: "Tomas Lindqvist",
    title: "Senior Procurement Analyst",
    division: "Industrial Automation",
    verified: true,
    dispatch: "Queued",
  },
  {
    ref: "OSC-IN-90888",
    email: "r.desilva@oscorp.com",
    grade: "G-9 · Operations",
    location: "Queens Plant 04, NY",
    joined: "2018-05-21",
    name: "Rohan De Silva",
    title: "Plant Operations Manager",
    division: "Heavy Machinery",
    verified: true,
    dispatch: "Dispatched",
  },
  {
    ref: "OSC-IN-90890",
    email: "a.moreau@oscorp.com",
    grade: "G-7 · Quality Assurance",
    location: "Fabrication Works, NJ",
    joined: "2023-02-13",
    name: "Amélie Moreau",
    title: "Quality Assurance Lead",
    division: "Heavy Machinery",
    verified: true,
    dispatch: "Dispatched",
  },
  {
    ref: "OSC-IN-90901",
    email: "d.okonkwo@oscorp.com",
    grade: "G-8 · Energy",
    location: "Helios-3 Turbine Hall, TX",
    joined: "2021-06-30",
    name: "Daniel Okonkwo",
    title: "Grid Integration Engineer",
    division: "Power & Energy",
    verified: true,
    dispatch: "Awaiting Signature",
  },
  {
    ref: "OSC-IN-90912",
    email: "h.tanaka@oscorp.com",
    grade: "G-6 · Field Service",
    location: "Control Systems Hub, MI",
    joined: "2024-09-09",
    name: "Hana Tanaka",
    title: "Field Service Supervisor",
    division: "Industrial Automation",
    verified: false,
    dispatch: "Queued",
  },
  {
    ref: "OSC-IN-90923",
    email: "v.petrov@oscorp.com",
    grade: "G-10 · Finance",
    location: "Corporate HQ, NY",
    joined: "2017-11-27",
    name: "Viktor Petrov",
    title: "Commercial Finance Controller",
    division: "HR",
    verified: true,
    dispatch: "Dispatched",
  },
  {
    ref: "OSC-IN-90934",
    email: "l.fernandes@oscorp.com",
    grade: "G-7 · Supply Chain",
    location: "Central Procurement, IL",
    joined: "2022-08-15",
    name: "Lucía Fernandes",
    title: "Logistics & Supply Chain Coordinator",
    division: "Heavy Machinery",
    verified: true,
    dispatch: "Dispatched",
  },
];

interface PortalContextValue {
  user: PortalUser | null;
  employee: Employee | null;
  employees: Employee[];
  addEmployee: (input: {
    name: string;
    title: string;
    division: Department;
    email: string;
    grade: string;
    location: string;
    verified: boolean;
  }) => { ok: boolean; message: string; ref: string; passcode: string };
  loginEmployee: (ref: string, passcode: string) => { ok: boolean; message: string };
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
    ownerRef?: string;
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
  const [employeeRef, setEmployeeRef] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>(seedEmployees);

  const employee = useMemo(
    () => employees.find((e) => e.ref === employeeRef) ?? null,
    [employees, employeeRef],
  );

  const addEmployee: PortalContextValue["addEmployee"] = useCallback(
    (input) => {
      const taken = new Set(employees.map((e) => e.ref));
      let ref = "";
      let n = 90940;
      while (!ref || taken.has(ref)) {
        ref = `OSC-IN-${n}`;
        n += 1;
      }
      if (employees.some((e) => e.email.toLowerCase() === input.email.trim().toLowerCase())) {
        return {
          ok: false,
          message: "A personnel record with this work email already exists.",
          ref: "",
          passcode: "",
        };
      }
      const record: Employee = {
        ref,
        name: input.name.trim(),
        title: input.title.trim(),
        division: input.division,
        email: input.email.trim(),
        grade: input.grade.trim(),
        location: input.location.trim(),
        verified: input.verified,
        dispatch: "Queued",
        joined: today,
      };
      setEmployees((prev) => [record, ...prev]);
      return {
        ok: true,
        message: `${record.name} added to the HR directory.`,
        ref,
        passcode: employeePasscode(ref),
      };
    },
    [employees],
  );

  const loginEmployee = useCallback(
    (ref: string, passcode: string) => {
      const match = employees.find((e) => e.ref.toLowerCase() === ref.trim().toLowerCase());
      if (!match) return { ok: false, message: "No personnel record found for this reference ID." };
      if (passcode !== employeePasscode(match.ref)) {
        return { ok: false, message: "Incorrect personnel passcode." };
      }
      setEmployeeRef(match.ref);
      return { ok: true, message: `Verified — ${match.name}, ${match.title}.` };
    },
    [employees],
  );

  const user = useMemo(() => users.find((u) => u.id === userId) ?? null, [users, userId]);

  const login = useCallback(
    (email: string, password: string) => {
      const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!found || found.password !== password) {
        return { ok: false, message: "Invalid credentials. Please try again." };
      }
      setUserId(found.id);
      // Admin accounts linked to an HR record also open their personnel desk.
      if (found.employeeRef) setEmployeeRef(found.employeeRef);
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
    setEmployeeRef(null);
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
    employee,
    employees,
    addEmployee,
    loginEmployee,
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

/**
 * Internal processing stage shown on the personnel desk. Approval outcomes are
 * deliberately not disclosed here — only where the file currently sits.
 */
export function trackingStage(status: QuotationStatus) {
  switch (status) {
    case "Submitted":
      return { label: "Lodged · awaiting intake", step: 1 };
    case "Under Review":
      return { label: "With contracts desk", step: 2 };
    default:
      return { label: "Processing closed · decision issued offline", step: 3 };
  }
}

