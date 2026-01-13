// src/features/properties/components/HeroSection.tsx
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { getHeroSlides, type HeroSlide } from '../services/propertyService';

import 'swiper/swiper-bundle.css';

export const HeroSection = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const fetchedSlides = await getHeroSlides();
        setSlides(fetchedSlides);
      } catch (err) {
        setError('No se pudieron cargar las imágenes.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  if (loading) {
    return (
      <section className="relative w-full h-[80vh] bg-gray-200 animate-pulse">
        {/* Placeholder para el estado de carga */}
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative w-full h-[80vh] bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[80vh] overflow-hidden bg-gray-100">
      {/* TEXTO GLOBAL EN LA PARTE SUPERIOR DERECHA */}
      <div className="absolute top-8 right-6 lg:right-12 z-20 pointer-events-none">
        {/* <p className="text-right font-bold text-xs lg:text-sm uppercase text-gray-400 tracking-widest drop-shadow-md">
          Explora propiedades en RD
        </p> */}
      </div>
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className={`relative w-full h-full flex items-center justify-center ${slide.isLocal ? 'bg-white' : ''}`}>

              {slide.isLocal ? (
                /* DISEÑO SLIDE 4 (TEXTO DENTRO DEL ARCO) */
                <div className="w-full flex justify-center items-center">
                  <div
                    className="w-full max-w-[320px] sm:max-w-[400px] lg:max-w-md h-[450px] lg:h-[600px] flex items-center justify-center p-8 lg:p-14 text-center transform hover:scale-105 transition-transform bg-no-repeat bg-center bg-contain"
                    style={{
                      backgroundImage: `url(${slide.img})`,
                    }}
                  >
                    <p className="font-black text-3xl sm:text-4xl lg:text-5xl leading-tight mt-4 lg:mt-10 text-gray-800">
                      Empieza tu <br />
                      <span className="text-red-600">pequeño</span> <br />
                      imperio
                    </p>
                  </div>
                </div>
              ) : (
                /* DISEÑO SLIDES 1-3 (FOTOS) */
                <>
                  <img
                    src={slide.img as string}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt={slide.titulo}
                  />
                  <div className="absolute inset-0 bg-black/40" />

                  {/* CONTENEDOR DEL TÍTULO: Abajo a la derecha */}
                  <div className="absolute bottom-2 right-6 lg:right-2 z-20 text-right max-w-2xl px-4">
                    <span className="md:text-2xl font-extrabold text-white drop-shadow-2xl leading-tight">
                      {slide.titulo}
                    </span>
                  </div>
                </>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
