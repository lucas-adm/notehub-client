import { Flame, toISODate, toRelativeTime } from "@/core";

interface TimeProps extends React.TimeHTMLAttributes<HTMLTimeElement> {
    flame: Flame;
}

export const Time = ({ flame, className, ...rest }: TimeProps) => (
    <time
        dateTime={toISODate(flame.created_at)}
        className={`text-xs dark:text-lighter/50 text-darker/50 ${className}`}
        {...rest}
    >
        Inflamada {toRelativeTime(flame.created_at)}
    </time>
)