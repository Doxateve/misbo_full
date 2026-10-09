import { Spinner } from "@/components/ui/spinner";

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <Spinner className="text-zinc-400 size-11" />
    </div>
  );
}
