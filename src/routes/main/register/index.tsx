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
import { formatDateTime } from "@/lib/utils"

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
    onSuccess: res => {
      console.log("suss", res)
    },
    onError: err => {
      console.log("err", err)
      toast.error(err.message)
    },
  })

  const onFormSubmit = (data: registerSchemaType) => {
    console.log(data)
    mutation.mutate(data)
  }

  const handleTestTime = () => {
    let testTime = "2026-08-15T18:00:00.000Z"
    // console.log("time", formatDateTime(testTime));
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
      <ActionBtn
        text="format time"
        type="button"
        onClick={handleTestTime}
      />
    </form>
  )
}

