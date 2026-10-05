"use client";

import { useMemo, useState } from "react";
import {
  DEMO_TODAY,
  addDays,
  bookingServices,
  bookingTimes,
  defaultHours,
  formatMoney,
  monthCells,
  presetUnavailable,
  seedAppointments,
  staffMembers,
  weekday,
  weekdayLabels,
  type Appointment,
  type DayHours,
} from "@/data/bookingCatalog";
import { cn } from "@/lib/cn";

type Screen = "book" | "appointments" | "admin";
type Step = "service" | "staff" | "schedule" | "details" | "summary" | "done";
type AdminTab = "today" | "analytics" | "calendar" | "people";

type Service = { id: string; name: string; minutes: number; price: number; detail: string; active: boolean };
type Staff = { id: string; name: string; role: string; active: boolean };

function statusOf(date: string, time: string, staffId: string, appointments: Appointment[]) {
  if (presetUnavailable(date, time, staffId)) return "unavailable" as const;
  const taken = appointments.some(
    (item) => item.status !== "cancelled" && item.date === date && item.time === time && item.staffId === staffId,
  );
  return taken ? ("booked" as const) : ("available" as const);
}

export function BookingDemo() {
  const [screen, setScreen] = useState<Screen>("book");
  const [step, setStep] = useState<Step>("service");
  const [adminTab, setAdminTab] = useState<AdminTab>("today");
  const [services, setServices] = useState<Service[]>(() => bookingServices.map((service) => ({ ...service })));
  const [staff, setStaff] = useState<Staff[]>(() => staffMembers.map((person) => ({ ...person })));
  const [hours, setHours] = useState<DayHours[]>(defaultHours);
  const [appointments, setAppointments] = useState<Appointment[]>(seedAppointments);
  const [serviceId, setServiceId] = useState<string>(bookingServices[0].id);
  const [staffId, setStaffId] = useState<string>(staffMembers[0].id);
  const [date, setDate] = useState(addDays(DEMO_TODAY, 1));
  const [time, setTime] = useState<string | null>(null);
  const [customer, setCustomer] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [confirmedId, setConfirmedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(seedAppointments[5].id);
  const [moving, setMoving] = useState(false);
  const [moveDate, setMoveDate] = useState(addDays(DEMO_TODAY, 2));
  const [moveTime, setMoveTime] = useState<string | null>(null);
  const [calendarDay, setCalendarDay] = useState(DEMO_TODAY);

  const activeServices = services.filter((service) => service.active);
  const activeStaff = staff.filter((person) => person.active);
  const service = services.find((item) => item.id === serviceId) ?? activeServices[0];
  const person = staff.find((item) => item.id === staffId) ?? activeStaff[0];
  const dates = Array.from({ length: 14 }, (_, index) => addDays(DEMO_TODAY, index));
  const selected = appointments.find((item) => item.id === selectedId) ?? null;

  const upcoming = appointments.filter((item) => item.status === "upcoming" && item.date >= DEMO_TODAY);
  const past = appointments.filter((item) => item.status !== "upcoming" || item.date < DEMO_TODAY);
  const todayItems = appointments.filter((item) => item.date === DEMO_TODAY && item.status !== "cancelled");
  const revenue = appointments.filter((item) => item.status !== "cancelled").reduce((sum, item) => sum + item.price, 0);
  const cancelled = appointments.filter((item) => item.status === "cancelled").length;
  const cancellationRate = appointments.length ? Math.round((cancelled / appointments.length) * 100) : 0;
  const activeCount = appointments.filter((item) => item.status !== "cancelled").length;
  const average = activeCount ? Math.round(revenue / activeCount) : 0;

  const popular = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of appointments) counts.set(item.serviceId, (counts.get(item.serviceId) ?? 0) + 1);
    let best = services[0]?.id ?? "";
    let bestCount = -1;
    for (const [id, count] of counts) {
      if (count > bestCount) {
        best = id;
        bestCount = count;
      }
    }
    return services.find((item) => item.id === best)?.name ?? "—";
  }, [appointments, services]);

  const byDay = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of appointments) {
      if (item.status === "cancelled") continue;
      counts.set(item.date, (counts.get(item.date) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [appointments]);
  const maxDay = Math.max(1, ...byDay.map(([, count]) => count));

  function openDay(value: string) {
    return hours.find((item) => item.day === weekday(value))?.open ?? false;
  }

  function chooseService(id: string) {
    setServiceId(id);
    setStep("staff");
    setError("");
  }

  function chooseStaff(id: string) {
    setStaffId(id);
    setTime(null);
    setStep("schedule");
  }

  function confirmBooking() {
    if (!service || !person || !time) return;
    if (!customer.name.trim() || !customer.email.includes("@")) {
      setError("Add a name and an email. This is a simulated booking.");
      return;
    }
    if (statusOf(date, time, person.id, appointments) !== "available") {
      setError("That time is no longer open.");
      return;
    }
    const id = `AB-${1041 + appointments.length}`;
    const next: Appointment = {
      id,
      serviceId: service.id,
      staffId: person.id,
      date,
      time,
      customerName: customer.name.trim(),
      email: customer.email.trim(),
      status: "upcoming",
      price: service.price,
    };
    setAppointments((current) => [...current, next]);
    setConfirmedId(id);
    setSelectedId(id);
    setError("");
    setStep("done");
  }

  function cancelAppointment(id: string) {
    setAppointments((current) => current.map((item) => (item.id === id ? { ...item, status: "cancelled" } : item)));
    setMoving(false);
  }

  function reschedule() {
    if (!selected || !moveTime) return;
    if (statusOf(moveDate, moveTime, selected.staffId, appointments.filter((item) => item.id !== selected.id)) !== "available") {
      setError("Choose an open time.");
      return;
    }
    setAppointments((current) =>
      current.map((item) => (item.id === selected.id ? { ...item, date: moveDate, time: moveTime, status: "upcoming" } : item)),
    );
    setMoving(false);
    setMoveTime(null);
    setError("");
  }

  const customers = useMemo(() => {
    const seen = new Map<string, { name: string; email: string; count: number }>();
    for (const item of appointments) {
      const current = seen.get(item.email) ?? { name: item.customerName, email: item.email, count: 0 };
      current.count += 1;
      seen.set(item.email, current);
    }
    return [...seen.values()];
  }, [appointments]);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-[#0d1016]">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-4 py-4">
        <div>
          <p className="font-mono text-[13px] leading-5 tracking-[0.14em] text-muted">NORTHLINE STUDIO</p>
          <h2 className="mt-1 text-xl font-medium tracking-tight">Appointment Booking</h2>
          <p className="text-[13px] leading-5 text-muted">Simulated Booking · fictional customers</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["book", "Book"],
              ["appointments", "Appointments"],
              ["admin", "Admin"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setScreen(id)}
              className={cn(
                "min-h-11 rounded-xl border px-3 text-sm",
                screen === id ? "border-foreground text-foreground" : "border-line text-muted",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {screen === "book" ? (
        <div className="p-4 sm:p-5">
          {step === "service" ? (
            <div className="grid gap-3 md:grid-cols-3">
              {activeServices.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => chooseService(item.id)}
                  className="min-h-11 rounded-2xl border border-line p-4 text-left"
                >
                  <p className="text-[15px] leading-6 font-medium">{item.name}</p>
                  <p className="mt-1 text-[13px] leading-5 text-muted">
                    {item.minutes} min · {formatMoney(item.price)}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted">{item.detail}</p>
                </button>
              ))}
            </div>
          ) : null}

          {step === "staff" ? (
            <div>
              <p className="text-sm text-muted">Service · {service?.name}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {activeStaff.map((item) => (
                  <button key={item.id} type="button" onClick={() => chooseStaff(item.id)} className="min-h-11 rounded-2xl border border-line px-4 py-3 text-left">
                    <p className="text-[15px] leading-6">{item.name}</p>
                    <p className="text-[13px] leading-5 text-muted">{item.role}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {step === "schedule" && person ? (
            <div>
              <p className="text-sm text-muted">
                {service?.name} · {person.name}
              </p>
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
                {dates.map((value) => {
                  const closed = !openDay(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      disabled={closed}
                      onClick={() => {
                        setDate(value);
                        setTime(null);
                      }}
                      className={cn(
                        "min-h-11 min-w-0 rounded-xl border px-1 text-[13px] leading-5",
                        value === date ? "border-foreground" : "border-line",
                        closed && "text-muted opacity-40",
                      )}
                    >
                      <span className="block">{weekdayLabels[weekday(value)].slice(0, 2)}</span>
                      <span className="block">{value.slice(8)}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {bookingTimes.map((value) => {
                  const state = statusOf(date, value, person.id, appointments);
                  return (
                    <button
                      key={value}
                      type="button"
                      disabled={state !== "available"}
                      onClick={() => setTime(value)}
                      className={cn(
                        "min-h-11 rounded-xl border px-3 text-sm",
                        time === value && state === "available" ? "border-foreground" : "border-line",
                        state !== "available" && "text-muted opacity-40",
                      )}
                    >
                      {value}
                      <span className="ml-2 text-[13px] text-muted">{state === "available" ? "Open" : state === "booked" ? "Booked" : "Closed"}</span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                disabled={!time}
                onClick={() => setStep("details")}
                className="mt-4 inline-flex min-h-11 items-center rounded-lg cta-primary px-4 text-sm disabled:opacity-40"
              >
                Continue
              </button>
            </div>
          ) : null}

          {step === "details" ? (
            <form
              className="max-w-md space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                setStep("summary");
                setError("");
              }}
            >
              <label className="block text-sm">
                Name
                <input
                  value={customer.name}
                  onChange={(event) => setCustomer((current) => ({ ...current, name: event.target.value }))}
                  className="mt-1 min-h-11 w-full rounded-xl border border-line bg-transparent px-3 text-[15px] outline-none"
                />
              </label>
              <label className="block text-sm">
                Email
                <input
                  value={customer.email}
                  onChange={(event) => setCustomer((current) => ({ ...current, email: event.target.value }))}
                  className="mt-1 min-h-11 w-full rounded-xl border border-line bg-transparent px-3 text-[15px] outline-none"
                />
              </label>
              <button type="submit" className="inline-flex min-h-11 items-center rounded-lg cta-primary px-4 text-sm">
                Review booking
              </button>
            </form>
          ) : null}

          {step === "summary" && service && person && time ? (
            <div className="max-w-md">
              <p className="font-mono text-[13px] leading-5 text-muted">BOOKING SUMMARY</p>
              <ul className="mt-3 space-y-2 text-[15px] leading-6">
                <li>{service.name} · {service.minutes} min</li>
                <li>{person.name}</li>
                <li>
                  {date} · {time}
                </li>
                <li>{customer.name || "Name missing"} · {customer.email || "Email missing"}</li>
                <li>{formatMoney(service.price)} · Simulated Booking</li>
              </ul>
              {error ? <p className="mt-3 text-sm text-muted">{error}</p> : null}
              <button type="button" onClick={confirmBooking} className="mt-4 inline-flex min-h-11 items-center rounded-lg cta-primary px-4 text-sm">
                Confirm simulated booking
              </button>
            </div>
          ) : null}

          {step === "done" ? (
            <div>
              <p className="font-mono text-[13px] leading-5 text-muted">SIMULATED BOOKING</p>
              <p className="mt-2 text-[15px] leading-6">Confirmed {confirmedId}. The time is now booked for this session. No payment was taken.</p>
              <button type="button" onClick={() => setScreen("appointments")} className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-line px-4 text-sm">
                View appointments
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {screen === "appointments" ? (
        <div className="grid gap-4 p-4 lg:grid-cols-[1fr_1fr] sm:p-5">
          <div>
            <p className="font-mono text-[13px] leading-5 text-muted">UPCOMING</p>
            <ul className="mt-2 divide-y divide-line border-y border-line">
              {upcoming.map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={() => setSelectedId(item.id)} className="min-h-11 w-full py-3 text-left text-sm">
                    {item.date} · {item.time} · {item.customerName}
                    <span className="mt-1 block text-[13px] text-muted">{item.status}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-5 font-mono text-[13px] leading-5 text-muted">PAST</p>
            <ul className="mt-2 divide-y divide-line border-y border-line">
              {past.map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={() => setSelectedId(item.id)} className="min-h-11 w-full py-3 text-left text-sm">
                    {item.customerName}
                    <span className="mt-1 block text-[13px] text-muted">
                      {item.date} · {item.status}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {selected ? (
            <div className="rounded-2xl border border-line p-4">
              <p className="text-[15px] leading-6 font-medium">{selected.customerName}</p>
              <p className="mt-1 text-sm text-muted">{selected.email}</p>
              <p className="mt-3 text-sm">
                {services.find((item) => item.id === selected.serviceId)?.name} · {staff.find((item) => item.id === selected.staffId)?.name}
              </p>
              <p className="mt-1 text-sm">
                {selected.date} · {selected.time} · {formatMoney(selected.price)}
              </p>
              <p className="mt-2 text-[13px] tracking-[0.12em] text-muted uppercase">{selected.status}</p>
              {selected.status === "upcoming" ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => setMoving((value) => !value)} className="min-h-11 rounded-xl border border-line px-3 text-sm">
                    Reschedule
                  </button>
                  <button type="button" onClick={() => cancelAppointment(selected.id)} className="min-h-11 rounded-xl border border-line px-3 text-sm">
                    Cancel
                  </button>
                </div>
              ) : null}
              {moving && selected.status === "upcoming" ? (
                <div className="mt-4">
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                    {dates.map((value) => (
                      <button
                        key={value}
                        type="button"
                        disabled={!openDay(value)}
                        onClick={() => {
                          setMoveDate(value);
                          setMoveTime(null);
                        }}
                        className={cn("min-h-11 min-w-0 rounded-xl border text-[13px]", value === moveDate ? "border-foreground" : "border-line")}
                      >
                        {value.slice(8)}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {bookingTimes.map((value) => {
                      const state = statusOf(moveDate, value, selected.staffId, appointments.filter((item) => item.id !== selected.id));
                      return (
                        <button
                          key={value}
                          type="button"
                          disabled={state !== "available"}
                          onClick={() => setMoveTime(value)}
                          className={cn("min-h-11 rounded-xl border px-3 text-sm", moveTime === value ? "border-foreground" : "border-line", state !== "available" && "opacity-40")}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                  {error ? <p className="mt-2 text-sm text-muted">{error}</p> : null}
                  <button type="button" onClick={reschedule} className="mt-3 inline-flex min-h-11 items-center rounded-lg cta-primary px-4 text-sm">
                    Save new time
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {screen === "admin" ? (
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {[
              ["Appointments", String(appointments.length)],
              ["Revenue", formatMoney(revenue)],
              ["Cancellation Rate", `${cancellationRate}%`],
              ["Average Booking Value", formatMoney(average)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-line p-3">
                <p className="text-[13px] leading-5 text-muted">{label}</p>
                <p className="mt-1 text-lg font-medium tabular-nums">{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted">Popular service · {popular}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(
              [
                ["today", "Today"],
                ["analytics", "Analytics"],
                ["calendar", "Calendar"],
                ["people", "Records"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setAdminTab(id)}
                className={cn("min-h-11 rounded-xl border px-3 text-sm", adminTab === id ? "border-foreground" : "border-line text-muted")}
              >
                {label}
              </button>
            ))}
          </div>

          {adminTab === "today" ? (
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {todayItems.length === 0 ? <li className="py-3 text-sm text-muted">No appointments today.</li> : null}
              {todayItems.map((item) => (
                <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                  <span>
                    {item.time} · {item.customerName}
                  </span>
                  <span className="text-muted">{item.status}</span>
                </li>
              ))}
              <li className="py-3 text-sm text-muted">Upcoming in this session: {upcoming.length}</li>
            </ul>
          ) : null}

          {adminTab === "analytics" ? (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div>
                <p className="font-mono text-[13px] leading-5 text-muted">BOOKINGS OVER TIME</p>
                <ul className="mt-3 space-y-2">
                  {byDay.map(([day, count]) => (
                    <li key={day} className="grid grid-cols-[5.5rem_1fr_1.5rem] items-center gap-2 text-[13px]">
                      <span className="text-muted">{day.slice(5)}</span>
                      <span className="h-2 rounded-full bg-white/10">
                        <span className="block h-2 rounded-full bg-foreground/80" style={{ width: `${(count / maxDay) * 100}%` }} />
                      </span>
                      <span className="tabular-nums">{count}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-mono text-[13px] leading-5 text-muted">STAFF PERFORMANCE</p>
                <ul className="mt-3 space-y-3">
                  {staff.map((member) => {
                    const rows = appointments.filter((item) => item.staffId === member.id && item.status !== "cancelled");
                    const earned = rows.reduce((sum, item) => sum + item.price, 0);
                    return (
                      <li key={member.id} className="text-sm">
                        <p>{member.name}</p>
                        <p className="text-[13px] text-muted">
                          {rows.length} bookings · {formatMoney(earned)}
                        </p>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-4 font-mono text-[13px] leading-5 text-muted">POPULAR SERVICES</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {services.map((item) => (
                    <li key={item.id}>
                      {item.name} · {appointments.filter((row) => row.serviceId === item.id).length}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          {adminTab === "calendar" ? (
            <div className="mt-4">
              <p className="text-sm text-muted">October 2026</p>
              <div className="mt-3 grid grid-cols-7 gap-1">
                {weekdayLabels.map((label) => (
                  <p key={label} className="min-w-0 text-center text-[11px] text-muted">
                    {label.slice(0, 1)}
                  </p>
                ))}
                {monthCells(2026, 10).map((value, index) => {
                  const count = value ? appointments.filter((item) => item.date === value && item.status !== "cancelled").length : 0;
                  return (
                    <button
                      key={value ?? `empty-${index}`}
                      type="button"
                      disabled={!value}
                      onClick={() => value && setCalendarDay(value)}
                      className={cn(
                        "aspect-square min-w-0 rounded-lg border text-[11px]",
                        value ? "border-line" : "border-transparent",
                        value === calendarDay && "border-foreground",
                      )}
                    >
                      {value ? value.slice(8) : ""}
                      {count > 0 ? <span className="block text-[10px] text-muted">{count}</span> : null}
                    </button>
                  );
                })}
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {appointments
                  .filter((item) => item.date === calendarDay)
                  .map((item) => (
                    <li key={item.id}>
                      {item.time} · {item.customerName} · {item.status}
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}

          {adminTab === "people" ? (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div>
                <p className="font-mono text-[13px] leading-5 text-muted">CUSTOMERS</p>
                <ul className="mt-2 space-y-2 text-sm">
                  {customers.map((item) => (
                    <li key={item.email}>
                      {item.name}
                      <span className="block text-[13px] text-muted">
                        {item.email} · {item.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="font-mono text-[13px] leading-5 text-muted">SERVICES</p>
                  {services.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setServices((current) => current.map((serviceItem) => (serviceItem.id === item.id ? { ...serviceItem, active: !serviceItem.active } : serviceItem)))
                      }
                      className="mt-2 flex min-h-11 w-full items-center justify-between rounded-xl border border-line px-3 text-left text-sm"
                    >
                      <span>
                        {item.name} · {item.minutes} min
                      </span>
                      <span className="text-[13px] text-muted">{item.active ? "Listed" : "Hidden"}</span>
                    </button>
                  ))}
                </div>
                <div>
                  <p className="font-mono text-[13px] leading-5 text-muted">STAFF</p>
                  {staff.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setStaff((current) => current.map((personItem) => (personItem.id === item.id ? { ...personItem, active: !personItem.active } : personItem)))}
                      className="mt-2 flex min-h-11 w-full items-center justify-between rounded-xl border border-line px-3 text-left text-sm"
                    >
                      <span>{item.name}</span>
                      <span className="text-[13px] text-muted">{item.active ? "Active" : "Hidden"}</span>
                    </button>
                  ))}
                </div>
                <div>
                  <p className="font-mono text-[13px] leading-5 text-muted">BUSINESS HOURS · 09:00–17:00</p>
                  <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-7">
                    {hours.map((item) => (
                      <button
                        key={item.day}
                        type="button"
                        onClick={() => setHours((current) => current.map((day) => (day.day === item.day ? { ...day, open: !day.open } : day)))}
                        className={cn("min-h-11 min-w-0 rounded-xl border text-[13px]", item.open ? "border-foreground" : "border-line text-muted")}
                      >
                        {weekdayLabels[item.day].slice(0, 2)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
