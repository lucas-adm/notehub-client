export const Submit = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        type="submit"
        className="whitespace-nowrap
        w-fit h-fit p-2 rounded self-center
        text-sm text-white
        bg-primary
        dark:drop-shadow-alpha-l-sm drop-shadow-alpha-d-sm
        hover:bg-secondary
        focus:bg-secondary
        transition-all"
        {...props}
    />
)