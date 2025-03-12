import { Field } from "react-hook-form";

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

declare interface formDataProps {
    table: 'teacher' | 'student' | 'class' | 'subject' | 'parent' | 'lesson' | 'exam' | 'assignment' | 'result' | 'attendance' | 'event' | 'announcement';
    type: 'create' | 'update' | 'delete';
    data?: any;
    id?: number;
}

declare interface TeacherFormProps {
    label: string;
    type?: string;
    register: any;
    name: string;
    defaultValue?: any;
    err?: FieldError;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}