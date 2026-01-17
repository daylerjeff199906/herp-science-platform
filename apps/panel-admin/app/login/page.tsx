import { LoginForm } from '@/components/login-form'
import { LogoRender } from '@repo/ui/logo'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-3">
      <div className="flex flex-col gap-4 p-6 md:p-10 lg:col-span-1">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <LogoRender className="h-16 w-16" />
            <span className="max-w-48 leading-tight text-xl">
              Vertebrados IIAP - Admin Panel
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block lg:col-span-2">
        <Image
          src="https://vertebrados.iiap.gob.pe/_next/static/media/specie_default.3717d154.webp"
          alt="Image"
          fill
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
