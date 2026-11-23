import { INITIAL_EVENTS } from '../../../data/mockData';
import EventDetailClient from '../../../components/EventDetailClient';

export function generateStaticParams() {
  return INITIAL_EVENTS.map((evt) => ({ id: evt.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EventDetailClient id={id} />;
}
