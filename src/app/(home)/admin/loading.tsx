import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHead,
    TableRow,
} from "@/components/ui/table"

function LoadingSkeleton() {
    return (
        <>
            <Skeleton className="my-8 h-8 w-1/3 mb-5 mx-auto" />
            <Table className="bg-white border-black">
                <TableHeader>
                    <TableRow>
                        <TableHead><Skeleton className="h-4 w-full" /></TableHead>
                        <TableHead><Skeleton className="h-4 w-full" /></TableHead>
                        <TableHead><Skeleton className="h-4 w-full" /></TableHead>
                        <TableHead><Skeleton className="h-4 w-full" /></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array(10).fill(1).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex items-center justify-center py-5 px-11">
                <Skeleton className="h-10 w-32" />
            </div>
        </>
    );
}

export default LoadingSkeleton;
