import Image from "next/image";

export default function BusinessLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative">
      <div className="absolute top-0 left-0 w-screen h-screen -z-10 overflow-hidden">
        <Image src="http://baiki.test/images/signup.webp" alt="Signup" fill />
      </div>
      <div className="bg-app-brand-white/70 backdrop-blur-xl w-1/2 h-screen flex flex-col justify-center items-center">
        <div className="flex items-center gap-4">
          <Image
            src="http://baiki.test/images/logo.webp"
            alt="Signup"
            width={50}
            height={50}
          />
          <p className="text-3xl">Baiki RMS</p>
        </div>
        {children}
      </div>
    </main>
  );
}
