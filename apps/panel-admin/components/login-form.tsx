'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { IAuth } from '@/types'
import { fetchAuthLogin } from '@/services/auth'

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'form'>) {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm<IAuth>()
  const router = useRouter()

  const onSubmit: SubmitHandler<IAuth> = async (data: IAuth) => {
    setLoading(true)

    const res = await fetchAuthLogin(data)

    if (res.status !== 200 && res.status !== 201) {
      toast.error(
        <div>
          <h2 className="text-sm font-semibold">
            Error en el inicio de sesión
          </h2>
          <p className="text-tiny text-gray-500">
            {res.errors?.[0] || 'Verifique su usuario y contraseña.'}
          </p>
        </div>
      )
      setLoading(false)
      return
    }

    const user = res.data
    if (!user?.user) {
      toast.error(
        <div>
          <h2 className="text-sm font-semibold">
            Error en el inicio de sesión
          </h2>
          <p className="text-tiny text-gray-500">
            Verifique su usuario y contraseña.
          </p>
        </div>
      )
      setLoading(false)
      return
    }

    if (user?.user?.id) {
      toast.success(
        <div>
          <h2 className="text-sm font-semibold">Inicio de sesión exitoso</h2>
          <p className="text-tiny text-gray-500">
            Bienvenido de vuelta, {user.user.username}
          </p>
        </div>
      )
      if (user?.user?.role !== 'BASIC_USER') {
        router.replace('/dashboard')
      }
    }
    setLoading(false)
  }

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      {...props}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Inicia sesión</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Por favor, ingresa tus credenciales para acceder al panel de
          administración.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Username"
            required
            {...register('username', { required: true })}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {/* <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a> */}
          </div>
          <Input
            id="password"
            type="password"
            required
            {...register('password', { required: true })}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Cargando...' : 'Continue'}
        </Button>
      </div>
    </form>
  )
}
