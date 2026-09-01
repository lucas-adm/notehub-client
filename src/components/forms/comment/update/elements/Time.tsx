import { Comment, toISODate, toRelativeTime } from "@/core";

interface TimeProps extends React.TimeHTMLAttributes<HTMLTimeElement> {
    comment: Comment;
    modified: boolean;
}

export const Time = ({ comment, modified, ...rest }: TimeProps) => (
    <time
        dateTime={toISODate(comment.created_at)}
        className="flex-none font-medium text-xs dark:text-lighter/50 text-darker/50"
        {...rest}
    >
        {modified
            ? <>{toRelativeTime(comment.created_at)} {"(editado)"}</>
            : toRelativeTime(comment.created_at)}
    </time>
)