export default function Header() {
  return (
    <div className="w-full py-8 bg-gradient-to-r from-[#005d28] via-[#fefefe] via-50% to-[#005d28] to-100%">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <img 
            src="https://uab.deporsite.net/img/logo_main.png" 
            alt="SAF Logo" 
            className="h-12 w-auto" // Changed from h-16 to h-12
          />
          <h1 className="text-5xl font-bold text-[#e31139] tracking-wide">
            Wrapped
          </h1>
        </div>
      </div>
    </div>
  );
};