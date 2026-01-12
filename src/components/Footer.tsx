export default function Footer() {
  return (
    <footer className="w-full py-6 px-4 mt-12 bg-white border-t border-gray-200">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            Fet amb amor ❤️ des de Catalunya per{' '}
            <a 
              href="https://la1qa.github.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-1 text-[#009889] hover:text-[#86c04d] transition-colors duration-200"
            >
              la1qa
            </a>
          </div>
          <span className="hidden md:inline">·</span>
          <div>
            Inspirat en {' '}
            <a 
              href="https://https://t-wrapped.nuvol.cat/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#009889] hover:text-[#86c04d] transition-colors duration-200"
            >
              T-Wrapped 
            </a>
             {' '} de {' '}
            <a 
              href="https://https://nuvol.cat/" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#009889] hover:text-[#86c04d] transition-colors duration-200"
            >
              Nuvol.cat
            </a>
          </div>
          <span className="hidden md:inline">·</span>
          <div className="flex items-center">
            <a 
              href="https://github.com/la1qa/SAF-Wrapped" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-[#009889] hover:text-[#86c04d] transition-colors duration-200"
            >
              Consulta el codi
            </a>
          </div>
          <span className="hidden md:inline">·</span>
          <div className="text-gray-500 text-xs text-center md:text-left">
            Projecte en clau humorística no vinculat al SAF ni a la UAB. 
          </div>
        </div>
      </div>
    </footer>
  );
};