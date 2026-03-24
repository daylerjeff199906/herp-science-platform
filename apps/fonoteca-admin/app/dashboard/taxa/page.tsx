import { getTaxa } from "@/actions/taxa";
import { TaxaClient } from "@/components/dashboard/taxa/taxa-client";

export default async function TaxaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = typeof params.search === "string" ? params.search : "";

  const { data, count, error } = await getTaxa({
    page,
    limit: 10,
    search,
  });

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return <TaxaClient data={data} count={count} />;
}
