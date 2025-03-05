declare type column = {
    header: string;
    accessor: string;
    className?: string;
}

declare interface TableProps {
    columns: column[];
    renderRow: (item: any) => React.ReactNode;
    data: any[];
}