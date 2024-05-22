import Image from "next/image";

export default function Home() {
  return (
    <main className="flex">
      <div className="h-screen w-full bg-slate-900/80"></div>
      <div className="h-screen w-full bg-indigo-900/80">
        <h1 className="text-4xl">Right side</h1>
      </div>
    </main>
  );
}
