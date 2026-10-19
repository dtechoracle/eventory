import { INITIAL_VENDORS } from '../../../data/mockData';
import VendorProfileClient from '../../../components/VendorProfileClient';

export function generateStaticParams() {
  return INITIAL_VENDORS.map((vnd) => ({ id: vnd.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <VendorProfileClient id={id} />;
}
