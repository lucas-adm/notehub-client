import { clsx } from "clsx";
import { usePathname } from "next/navigation";
import Link, { LinkProps } from "next/link";

interface ShortcutProps extends LinkProps {
    icon: React.ReactNode;
    text: string;
}

export const Shortcut = (props: ShortcutProps) => {

    const { icon, text, ...rest } = props;

    const pathname = usePathname();

    const active: boolean = pathname === rest.href

    return (
        <Link
            aria-current={active ? 'page' : undefined}
            className={clsx(
                'cursor-pointer',
                'py-3 px-1',
                'flex flex-col items-center gap-1',
                'rounded-xl',
                active
                    ? 'text-lighter bg-primary'
                    : 'hover:dark:bg-semilight/10 hover:bg-semidark/10',
                'transition-colors'
            )}
            {...rest}
        >
            {icon}
            <span className="text-center text-sm">{text}</span>
        </Link>
    )

}