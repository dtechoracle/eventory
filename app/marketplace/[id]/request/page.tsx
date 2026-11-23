import { INITIAL_VENDORS } from '../../../../data/mockData';
import VendorRequestClient from '../../../../components/VendorRequestClient';

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
  return <VendorRequestClient id={id} />;
}
