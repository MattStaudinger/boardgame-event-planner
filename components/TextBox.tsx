type TextBoxProps = {
  label: string
}

export default async function TextBox({ label }: TextBoxProps) {
  return (
    <div className="bg-white w-full gap-[8px] h-[48px] rounded-lg flex justify-center items-center text-black/75 p-[16px] border-2 border-solid border-custom-green-pastel hover:border-custom-green-pastel/60 hover:animate-wiggle">
      {label && <span>{label}</span>}
    </div>
  )
}
