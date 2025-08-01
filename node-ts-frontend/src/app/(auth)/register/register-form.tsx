'use client'
import { cn } from "@/lib/utils"
import { RegisterUserSchema } from "@/schema/auth-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { AuthActions } from "@/api-actions/auth-actions"
import { useState } from "react"
export type RegisterFormData = z.infer<typeof RegisterUserSchema>
import withGuest from "@/components/hoc/with-guest"
import { EqualApproximately } from "lucide-react"


function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [email, setEmail] = useState("")
  const [verification_code, setVerification_code] = useState("")
  const [otpLoading, setOtpLoading] = useState(false)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  })

  function onSubmit(values: RegisterFormData) {
    setIsLoading(true)
    AuthActions.register(values)
      .then(() => {
        setEmail(values.email)
        setShowOtp(true)
        toast.success("Registration successful! Please check your email for the OTP.")
      })
      .catch((error) => {
        toast.error(error.response?.data.apiError.message || "Registration failed.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setOtpLoading(true)
    AuthActions.verify_email({ email, verification_code })
      .then(() => {
        toast.success("Email verified successfully!")
        setShowOtp(false)
        setVerification_code("")
        form.reset()
      })
      .catch((error) => {
        toast.error(error.response?.data.apiError.message || "OTP verification failed.")
      })
      .finally(() => {
        setOtpLoading(false)
      })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your details below to create your account
        </p>
      </div>
      {!showOtp ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              Create Account
            </Button>
          </form>
        </Form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="grid gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-xl font-semibold">Verify OTP</h2>
            <p className="text-muted-foreground text-sm">Enter the OTP sent to your email</p>
          </div>
          <Input
            type="text"
            placeholder="Enter OTP"
            value={verification_code}
            onChange={e => setVerification_code(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={otpLoading}>
            {otpLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      )}
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-background text-muted-foreground relative z-10 px-2">
          Or continue with
        </span>
      </div>
      <Button variant="outline" className="w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
            fill="currentColor"
          />
        </svg>
        Sign up with GitHub
      </Button>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="underline underline-offset-4">
          Sign in
        </a>
      </div>
    </div>
  )
}


export default withGuest(RegisterForm)