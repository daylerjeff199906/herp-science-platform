export const LogoRender = ({
  className,
  ...props
}: React.ComponentProps<'img'>) => {
  return (
    <img
      src="https://aguasamazonicas.org/wp-content/uploads/2021/06/imagem_2023-05-29_120804614.png"
      alt="Logo Vertebrados"
      className={className}
      {...props}
    />
  )
}
