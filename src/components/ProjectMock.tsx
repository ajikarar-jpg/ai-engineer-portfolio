import { AgentMock } from "@/components/mocks/AgentMock";
import { BookingMock } from "@/components/mocks/BookingMock";
import { DeliveryMock } from "@/components/mocks/DeliveryMock";
import { SupportMock } from "@/components/mocks/SupportMock";
import { StoreMock } from "@/components/mocks/StoreMock";

type ProjectMockProps = {
  slug: string;
  compact?: boolean;
  decorative?: boolean;
};

export function ProjectMock({ slug, compact = false, decorative = false }: ProjectMockProps) {
  if (slug === "ai-agent-platform") return <AgentMock compact={compact} decorative={decorative} />;
  if (slug === "ai-customer-support") return <SupportMock compact={compact} decorative={decorative} />;
  if (slug === "delivery-intelligence") return <DeliveryMock compact={compact} decorative={decorative} />;
  if (slug === "ecommerce-platform") return <StoreMock compact={compact} decorative={decorative} />;
  if (slug === "appointment-booking") return <BookingMock compact={compact} decorative={decorative} />;
  return null;
}
