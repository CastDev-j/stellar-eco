import { redirect } from "next/navigation";

export default function Page({ params }: any) {
  const target = `/nasa-image-video/${encodeURIComponent(params.nasaId)}`;
  return redirect(target);
}
