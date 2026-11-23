import { INITIAL_VENDORS } from '../../../data/mockData';
import VendorProfileClient from '../../../components/VendorProfileClient';

export function generateStaticParams() {
  const params: { id: string }[] = [];
  INITIAL_VENDORS.forEach((vnd) => {
    params.push({ id: vnd.id });
    if (vnd.slug) {
      params.push({ id: vnd.slug });
    }
  });
  return params;
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <VendorProfileClient id={id} />;
}
