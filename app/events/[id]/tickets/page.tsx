import { INITIAL_EVENTS } from '../../../../data/mockData';
import EventTicketsCheckoutPage from '../../../../components/EventTicketsCheckoutPage';

export function generateStaticParams() {
  return INITIAL_EVENTS.map((evt) => ({ id: evt.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EventTicketsCheckoutPage id={id} />;
}
