import { MockFrame } from "@/components/mocks/MockFrame";

const slots = [
  { time: "09:00", state: "Open" },
  { time: "10:00", state: "Booked" },
  { time: "11:00", state: "Closed" },
] as const;

export function BookingMock({ decorative = false }: { compact?: boolean; decorative?: boolean }) {
  return (
    <MockFrame label="BOOKING" decorative={decorative}>
      <p className="text-sm">Consultation · 60 min · Lena Ortiz</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {slots.map((slot) => (
          <p key={slot.time} className="rounded-lg border border-line px-3 py-2 text-sm">
            {slot.time}
            <span className="ml-2 text-xs text-muted">{slot.state}</span>
          </p>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">Simulated Booking</p>
    </MockFrame>
  );
}
