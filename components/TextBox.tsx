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
        "text-white",
        "p-[16px]",

        {
          "hover:bg-custom-blue/75": index % 2 === 0,
          "bg-custom-blue": index % 2 === 0,
          "hover:bg-custom-green-pastel/75": index % 2 === 1,
          "bg-custom-green-pastel": index % 2 === 1,
        }
      )}
    >
      {label && <span>{label}</span>}
      {children}
    </div>
  )
}
