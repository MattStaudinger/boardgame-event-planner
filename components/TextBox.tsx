import classnames from "classnames"

type TextBoxProps = {
  index: number
  label?: string
  children?: React.ReactNode
}

export default async function TextBox({
  index,
  label,
  children,
}: TextBoxProps) {
  return (
    <div
      className={classnames(
        "bg-[#ECECEC]",
        "w-full",
        "h-[48px]",
        "rounded-lg",
        "flex",
        "justify-center",
        "items-center",

        "p-[16px]",

        {
          "hover:bg-[#e0e0e0]": index % 2 === 0,
          "bg-[#ECECEC]": index % 2 === 0,
          "hover:bg-[#d6d6d6]": index % 2 === 1,
          "bg-[#b9b9b9]": index % 2 === 1,
        }
      )}
    >
      {label && <span>{label}</span>}
      {children}
    </div>
  )
}
