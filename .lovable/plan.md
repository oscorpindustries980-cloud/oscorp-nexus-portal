# HR Panel for Shreya Kumari

## What you get

A separate HR console, opened only by Shreya Kumari's login, where she can:

- See and search the full personnel directory (all reference IDs).
- Add new personnel — the record saves in the portal and shows up on her next HR login, in the public verification hub, and lets that person sign in to the personnel desk with the issued reference ID and passcode.
- Toggle each person's verification badge (Verified / Pending).
- Change document dispatch status (Queued / Awaiting Signature / Dispatched).
- Review quotations and approve them (with final approved price and notes) or reject them — same decision power as the admin panel, in her own HR screen.

HR login: **angeltripathi.2802@gmail.com** with password **Shreya@2026** (name on the account: Shreya Kumari, personnel ref OSC-IN-90821). She can also still sign in on the personnel tab with the reference ID and passcode.

## Already in place from the previous round

- Admin panel already shows Approve / Reject / Review / Download on every quotation, including files uploaded from the employee desk.
- The employee desk "My project files" table already shows the decision — approved price and admin notes, or rejected — as soon as it is recorded.
- The HR directory add form already saves the new personnel record into the live portal state.

These stay as they are; the new HR panel reuses the same data so the two consoles always agree.

## Notes

- Everything runs on the portal's in-memory mock data, so records reset when the page is fully reloaded — same as the rest of the demo portal today. Say the word if you want this stored permanently in a real database instead.

## Technical detail

- `src/lib/portal-store.tsx`
  - Shreya's user record (USR-002) becomes role `HR` with `email: angeltripathi.2802@gmail.com`, `password: Shreya@2026`, `employeeRef: OSC-IN-90821`.
  - `PortalUser["role"]` union gains `"HR"`; expose `isHR` from the context. `isAdmin` stays admin-only, and approve/reject actions are allowed for `isAdmin || isHR`.
  - New actions: `setEmployeeVerified(ref, verified)` and `setEmployeeDispatch(ref, dispatch)`, both mapping over `employees` state.
- New route `src/routes/hr.tsx` (`/hr`), with its own `head()` metadata. Renders an access-denied card unless `isHR || isAdmin`. Tabs:
  - Personnel: search + division filter, verification toggle (Switch), dispatch `Select`, add-personnel form via existing `addEmployee`, toast with returned ref + passcode.
  - Quotations: reuse the admin table shape with the approve modal (final price + notes) and reject action.
- `src/components/site-header.tsx`: show an "HR Panel" nav link and session chip when `isHR`.
- `src/components/auth-dialog.tsx`: no credential hints added; login path already handles any role.
