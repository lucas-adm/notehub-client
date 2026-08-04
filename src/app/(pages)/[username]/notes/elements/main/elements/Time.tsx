import { LowDetailNote, toISODate, toRelativeTime } from "@/core";

interface TimeProps extends React.TimeHTMLAttributes<HTMLTimeElement> {
    note: LowDetailNote;
}

export const Time = ({ note, className, ...rest }: TimeProps) => (
    <time
        dateTime={toISODate(note.created_at)}
        className={`text-xs dark:text-lighter/50 text-darker/50 ${className}`}
        {...rest}
    >
        {note.modified
            ? `Atualizada ${toRelativeTime(note.modified_at)}`
            : `Criada ${toRelativeTime(note.created_at)}`
        }
    </time>
)