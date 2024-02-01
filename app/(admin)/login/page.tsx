import LoginForm from "@/components/LoginForm";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div className="flex justify-center items-center m-auto h-screen w-60">
      <LoginForm></LoginForm>
      {searchParams?.message && (
        <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
          {searchParams.message}
        </p>
      )}
    </div>
  );
}
