// src/shared/layout/Footer.tsx
export const Footer = () => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
      <div>
        <h3 className="text-xl font-bold mb-4 text-espacios-red">Espacios RD</h3>
        <p className="text-gray-400 text-sm">Expertos en el mercado inmobiliario dominicano. La perlita de América.</p>
      </div>
      <div className="flex flex-col gap-2 text-sm text-gray-400">
        <span className="font-bold text-white mb-2 uppercase">Enlaces</span>
        <a href="#" className="hover:text-white">Inicio</a>
        <a href="#" className="hover:text-white">Propiedades</a>
        <a href="#" className="hover:text-white">Contacto</a>
      </div>
      <div className="text-sm text-gray-400">
        <span className="font-bold text-white mb-2 uppercase">Contacto</span>
        <p>Santo Domingo, RD</p>
        <p>info@espaciosrd.com</p>
      </div>
    </div>
  </footer>
);
