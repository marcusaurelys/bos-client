import { Skeleton } from "@/components/ui/skeleton";

function FilterSkeleton() {
  return (
    <div className="h-8 border-dashed shadow-sm bg-background text-sm my-2 flex flex-row items-center border border-primary/25 rounded p-3">
      <Skeleton className="h-4 w-4 mr-2" />
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

function ColumnSkeleton() {
  return (
    <div className="z-0 relative shadow-sm flex flex-col h-[calc(100vh-12rem)] bg-muted w-96 rounded-md p-3">
      {/* column header */}
      <div className="flex flex-row gap-2 items-center my-1 h-7">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-10" />
      </div>
      {/* column body */}
      <div className="h-full flex-auto gap-2 flex flex-col">
        {Array(5).fill(5).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

function Loading() {
  return (
    <main className="w-full h-[calc(100vh-3rem)] flex justify-center">
      <div className="w-full flex flex-row">
        <div className="flex justify-center items-start w-full h-full">
          <div className="flex flex-col w-fit justify-center">
            <div className="z-10 relative my-3">
              <FilterSkeleton />
            </div>
            <div className="flex gap-12 flex-wrap">
              <ColumnSkeleton />
              <ColumnSkeleton />
              <ColumnSkeleton />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Loading;