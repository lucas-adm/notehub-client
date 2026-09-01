import { forwardRef } from "react";
import { IconChevronDown } from "@tabler/icons-react";

interface SelectProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isDropdownOpen: boolean;
    text: string;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(({ isDropdownOpen, text, ...rest }, ref) => {
    return (
        <li className='select-none relative insm:static'>
            <button
                ref={ref}
                aria-label="Abrir menu"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                className="px-2 py-1 rounded-xl flex items-center gap-1
                border dark:border-light/10 border-dark/10
                dark:bg-dark bg-light
                hover:dark:bg-semidark hover:bg-semilight
                transition-colors"
                {...rest}
            >
                <span>{text}</span>
                <span><IconChevronDown size={18} /></span>
            </button>
            {rest.children}
        </li>
    )
})

Select.displayName = 'Select';