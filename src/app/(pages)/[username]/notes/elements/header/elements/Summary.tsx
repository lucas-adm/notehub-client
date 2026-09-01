import { forwardRef } from "react";
import { IconX } from "@tabler/icons-react";

interface SummaryProps extends React.HTMLAttributes<HTMLDivElement> {
    dataTestId: 'close-type-menu' | 'close-tags-menu' | 'close-order-menu' | 'close-sort-menu';
    summary: string;
}

export const Summary = forwardRef<HTMLButtonElement, SummaryProps>(({ dataTestId, summary, ...rest }, ref) => {
    return (
        <div
            className="p-2
            flex items-center justify-between gap-3
            border-b dark:border-light/10 border-dark/10
            dark:bg-semidark bg-semilight"
            {...rest}
        >
            <span className="text-xs">{summary}</span>
            <button
                ref={ref}
                aria-label="Fechar menu"
                data-testid={dataTestId}
                className="hover:opacity-50 transition-opacity"
            >
                <IconX size={15} />
            </button>
        </div>
    )
})

Summary.displayName = 'Summary';