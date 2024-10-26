import Image from "next/image";

export default function DashboardHeader() {
  return (
    <header className="bg-white shadow-sm ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
        <Image
          src="/logo.svg"
          alt="Language Learning App Logo"
          width={40}
          height={32}
          className="mr-4 invert"
        />
        <h1 className="text-2xl font-bold text-gray-900">Langoo</h1>
      </div>
    </header>
  );
}
