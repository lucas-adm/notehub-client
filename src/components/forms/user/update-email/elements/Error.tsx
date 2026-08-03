import { EmailChangeFormData } from "@/core";
import { useFormContext } from "react-hook-form";

interface ErrorProps extends React.HTMLAttributes<HTMLSpanElement> {
    name: keyof EmailChangeFormData;
}

export const Error = ({ name, ...rest }: ErrorProps) => {

    const { formState: { errors } } = useFormContext();

    const error = errors[name]?.message;

    if (error) return (
        <span
            data-testid={`error-${name}`}
            className="absolute top-[110%] left-2 font-medium text-sm text-red-600"
            {...rest}
        >
            {error.toString()}
        </span>
    )

    return null;

}