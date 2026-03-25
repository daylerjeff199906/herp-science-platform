import { getTaxa } from "@/actions/taxa";
import { TaxaClient } from "@/components/dashboard/taxa/taxa-client";
import { LayoutWrapper } from "@/components/panel-admin/layout-wrapper";

export default async function TaxaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = typeof params.search === "string" ? params.search : "";
  const kingdom = typeof params.kingdom === "string" ? params.kingdom : undefined;
  const family_id = typeof params.family_id === "string" ? params.family_id : undefined;
  const genus_id = typeof params.genus_id === "string" ? params.genus_id : undefined;

  const { data, count, error } = await getTaxa({
    page,
    limit: 10,
    search,
    kingdom,
    family_id,
    genus_id,
  });

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <LayoutWrapper sectionTitle="Taxonomía">
      <TaxaClient data={data} count={count} />
    </LayoutWrapper>
  );
}

