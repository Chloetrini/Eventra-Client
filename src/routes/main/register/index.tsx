import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import ActionBtn from "@/components/ui/action-btn"
import { registerSchema } from "@/lib/schema"
import { z } from "zod"
import { useState } from "react"
import { api } from "@/lib/api"
import { useMutation } from "@tanstack/react-query"
import { FormBox } from "@/components/ui/form-box"
import { toast } from "react-hot-toast"

type registerSchemaType = z.infer<typeof registerSchema>

export default function Register() {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const { register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  })

  const mutation = useMutation({
    mutationFn: (data: registerSchemaType) => {
      return api.post('/auth/register', data)
    },
    onError: err => {
      toast.error(err.message)
    },
  })

  const onFormSubmit = (data: registerSchemaType) => {
    mutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <FormBox
        label="Password"
        type="password"
        placeholder="******"
        id="password"
        register={register}
        errors={errors?.password}
        name="password"
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
      <ActionBtn
        text="Log In"
        type="submit"
        loading={mutation.isPending}
        size="lg"
        classname="w-full h-14 border bg-purple-700  text-white hover:bg-purple-700/90"
      />
    </form>
  )
}

