import { SkeletonTable } from '@/components/miscellaneous/skeleton-table'

export default function Loading() {
  return (
    <>
      <SkeletonTable columns={6} rows={8} />
    </>
  )
}
