type Props = {
  className?: string
  icon?: React.ReactNode
}

const WebAppVersion = (props: Props) => {
  const { className, icon } = props
  return (
    <div
      className={`text-[11px] text-slate-600 flex items-center justify-center gap-1 ${className}`}
    >
      {icon && icon}v 1.0.0-alpha Supported by MDKCraft technology
    </div>
  )
}

export default WebAppVersion
