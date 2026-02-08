'use client'
export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <div
        className="h-20 bg-gray-900"
      />
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </>
  )
}
