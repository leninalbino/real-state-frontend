// Archivo: src/shared/data/locations.ts

export interface Distrito {
  nombre: string;
}

export interface Municipio {
  nombre: string;
  distritos: (string | Distrito)[]; // El JSON tiene strings, no objetos Distrito
}

export interface Provincia {
  nombre: string;
  municipios: Municipio[];
}

export const DOMINICAN_REPUBLIC_LOCATIONS: Provincia[] = [
  {
    "nombre": "Distrito Nacional",
    "municipios": [
      { "nombre": "Distrito Nacional", "distritos": [] }
    ]
  },
  {
    "nombre": "Azua",
    "municipios": [
      { "nombre": "Azua de Compostela", "distritos": ["Barreras", "Barro Arriba", "Clavellina", "Emma Balaguer Viuda Vallejo", "Las Barías-La Estancia", "Las Lomas", "Los Jovillos", "Puerto Viejo"] },
      { "nombre": "Estebanía", "distritos": [] },
      { "nombre": "Guayabal", "distritos": [] },
      { "nombre": "Las Charcas", "distritos": ["Hatillo", "Palmar de Ocoa"] },
      { "nombre": "Las Yayas de Viajama", "distritos": ["Villarpando", "Hato Nuevo-Cortés"] },
      { "nombre": "Padre Las Casas", "distritos": ["La Siembra", "Las Lagunas", "Los Fríos"] },
      { "nombre": "Peralta", "distritos": [] },
      { "nombre": "Pueblo Viejo", "distritos": ["El Rosario"] },
      { "nombre": "Sabana Yegua", "distritos": ["Proyecto 4", "Ganadero", "Proyecto 2-C"] },
      { "nombre": "Tábara Arriba", "distritos": ["Amiama Gómez", "Los Toros", "Tábara Abajo"] }
    ]
  },
  {
    "nombre": "Baoruco",
    "municipios": [
      { "nombre": "Neiba", "distritos": ["El Palmar"] },
      { "nombre": "Galván", "distritos": ["El Salado"] },
      { "nombre": "Los Ríos", "distritos": ["Las Clavellinas"] },
      { "nombre": "Tamayo", "distritos": ["Cabeza de Toro", "Mena", "Monserrat", "Santa Bárbara-El 6", "Santana", "Uvilla"] },
      { "nombre": "Villa Jaragua", "distritos": [] }
    ]
  },
  {
    "nombre": "Barahona",
    "municipios": [
      { "nombre": "Barahona", "distritos": ["El Cachón", "La Guázara", "Villa Central"] },
      { "nombre": "Cabral", "distritos": [] },
      { "nombre": "El Peñón", "distritos": [] },
      { "nombre": "Enriquillo", "distritos": ["Arroyo Dulce"] },
      { "nombre": "Fundación", "distritos": ["Pescadería"] },
      { "nombre": "Jaquimeyes", "distritos": ["Palo Alto"] },
      { "nombre": "La Ciénaga", "distritos": ["Bahoruco"] },
      { "nombre": "Las Salinas", "distritos": [] },
      { "nombre": "Paraíso", "distritos": ["Los Patos"] },
      { "nombre": "Polo", "distritos": [] },
      { "nombre": "Vicente Noble", "distritos": ["Canoa", "Fondo Negro", "Quita Coraza"] }
    ]
  },
  {
    "nombre": "Dajabón",
    "municipios": [
      { "nombre": "Dajabón", "distritos": ["Cañongo"] },
      { "nombre": "El Pino", "distritos": ["Manuel Bueno"] },
      { "nombre": "Loma de Cabrera", "distritos": ["Capotillo", "Santiago de la Cruz"] },
      { "nombre": "Partido", "distritos": [] },
      { "nombre": "Restauración", "distritos": [] }
    ]
  },
  {
    "nombre": "Duarte",
    "municipios": [
      { "nombre": "San Francisco de Macorís", "distritos": ["Cenoví", "Jaya", "La Peña", "Presidente Don Antonio Guzmán Fernández"] },
      { "nombre": "Arenoso", "distritos": ["Aguacate", "Las Coles"] },
      { "nombre": "Castillo", "distritos": [] },
      { "nombre": "Eugenio María de Hostos", "distritos": ["Sabana Grande"] },
      { "nombre": "Las Guáranas", "distritos": [] },
      { "nombre": "Pimentel", "distritos": [] },
      { "nombre": "Villa Riva", "distritos": ["Agua Santa del Yuna", "Barraquito", "Cristo Rey de Guaraguao", "Las Táranas"] }
    ]
  },
  {
    "nombre": "El Seibo",
    "municipios": [
      { "nombre": "El Seibo", "distritos": ["Pedro Sánchez", "San Francisco-Vicentillo", "Santa Lucía"] },
      { "nombre": "Miches", "distritos": ["El Cedro", "La Gina"] }
    ]
  },
  {
    "nombre": "Elías Piña",
    "municipios": [
      { "nombre": "Comendador", "distritos": ["Guayabo", "Sabana Larga"] },
      { "nombre": "Bánica", "distritos": ["Sabana Cruz", "Sabana Higüero"] },
      { "nombre": "El Llano", "distritos": ["Guanito"] },
      { "nombre": "Hondo Valle", "distritos": ["Rancho de la Guardia"] },
      { "nombre": "Juan Santiago", "distritos": [] },
      { "nombre": "Pedro Santana", "distritos": ["Río Limpio"] }
    ]
  },
  {
    "nombre": "Espaillat",
    "municipios": [
      { "nombre": "Moca", "distritos": ["Canca La Reina", "El Higüerito", "José Contreras", "Juan López", "La Ortega", "Las Lagunas", "Monte de la Jagua", "San Víctor"] },
      { "nombre": "Cayetano Germosén", "distritos": [] },
      { "nombre": "Gaspar Hernández", "distritos": ["Joba Arriba", "Veragua", "Villa Magante"] },
      { "nombre": "Jamao al Norte", "distritos": [] }
    ]
  },
  {
    "nombre": "Hato Mayor",
    "municipios": [
      { "nombre": "Hato Mayor del Rey", "distritos": ["Guayabo Dulce", "Mata Palacio", "Yerba Buena"] },
      { "nombre": "El Valle", "distritos": [] },
      { "nombre": "Sabana de la Mar", "distritos": ["Elupina Cordero de Las Cañitas"] }
    ]
  },
  {
    "nombre": "Hermanas Mirabal",
    "municipios": [
      { "nombre": "Salcedo", "distritos": ["Jamao Afuera"] },
      { "nombre": "Tenares", "distritos": ["Blanco"] },
      { "nombre": "Villa Tapia", "distritos": [] }
    ]
  },
  {
    "nombre": "Independencia",
    "municipios": [
      { "nombre": "Jimaní", "distritos": ["Boca de Cachón", "El Limón"] },
      { "nombre": "Cristóbal", "distritos": ["Batey 8"] },
      { "nombre": "Duvergé", "distritos": ["Vengan a Ver"] },
      { "nombre": "La Descubierta", "distritos": [] },
      { "nombre": "Mella", "distritos": ["La Colonia"] },
      { "nombre": "Postrer Río", "distritos": ["Guayabal"] }
    ]
  },
  {
    "nombre": "La Altagracia",
    "municipios": [
      { "nombre": "Higüey", "distritos": ["La Otra Banda", "Lagunas de Nisibón", "Verón-Punta Cana"] },
      { "nombre": "San Rafael del Yuma", "distritos": ["Bayahibe", "Boca de Yuma"] }
    ]
  },
  {
    "nombre": "La Romana",
    "municipios": [
      { "nombre": "La Romana", "distritos": ["Caleta"] },
      { "nombre": "Guaymate", "distritos": [] },
      { "nombre": "Villa Hermosa", "distritos": ["Cumayasa"] }
    ]
  },
  {
    "nombre": "La Vega",
    "municipios": [
      { "nombre": "La Concepción de La Vega", "distritos": ["El Ranchito", "Río Verde Arriba"] },
      { "nombre": "Constanza", "distritos": ["La Sabina", "Tireo"] },
      { "nombre": "Jarabacoa", "distritos": ["Buena Vista", "Manabao"] },
      { "nombre": "Jima Abajo", "distritos": ["Rincón"] }
    ]
  },
  {
    "nombre": "María Trinidad Sánchez",
    "municipios": [
      { "nombre": "Nagua", "distritos": ["Arroyo al Medio", "Las Gordas", "San José de Matanzas"] },
      { "nombre": "Cabrera", "distritos": ["Arroyo Salado", "La Entrada"] },
      { "nombre": "El Factor", "distritos": ["El Pozo"] },
      { "nombre": "Río San Juan", "distritos": [] }
    ]
  },
  {
    "nombre": "Monseñor Nouel",
    "municipios": [
      { "nombre": "Bonao", "distritos": ["Arroyo Toro-Masipedro", "La Salvia-Los Quemados", "Jayaco", "Juma Bejucal", "Sabana del Puerto"] },
      { "nombre": "Maimón", "distritos": [] },
      { "nombre": "Piedra Blanca", "distritos": ["Juan Adrián", "Villa Sonador"] }
    ]
  },
  {
    "nombre": "Montecristi",
    "municipios": [
      { "nombre": "Montecristi", "distritos": [] },
      { "nombre": "Castañuela", "distritos": ["Palo Verde"] },
      { "nombre": "Guayubín", "distritos": ["Cana Chapetón", "Hatillo Palma", "Villa Elisa"] },
      { "nombre": "Las Matas de Santa Cruz", "distritos": [] },
      { "nombre": "Pepillo Salcedo", "distritos": [] },
      { "nombre": "Villa Vásquez", "distritos": [] }
    ]
  },
  {
    "nombre": "Monte Plata",
    "municipios": [
      { "nombre": "Monte Plata", "distritos": ["Boyá", "Chirino", "Don Juan"] },
      { "nombre": "Bayaguana", "distritos": [] },
      { "nombre": "Peralvillo", "distritos": [] },
      { "nombre": "Sabana Grande de Boyá", "distritos": ["Gonzalo", "Majagual"] },
      { "nombre": "Yamasá", "distritos": ["Los Botados"] }
    ]
  },
  {
    "nombre": "Pedernales",
    "municipios": [
      { "nombre": "Pedernales", "distritos": ["José Francisco Peña Gómez", "Juancho"] },
      { "nombre": "Oviedo", "distritos": [] }
    ]
  },
  {
    "nombre": "Peravia",
    "municipios": [
      { "nombre": "Baní", "distritos": ["Catalina", "El Carretón", "El Limonal", "Las Barías", "Matanzas", "Paya", "Sabana Buey", "Villa Fundación", "Villa Sombrero"] },
      { "nombre": "Nizao", "distritos": ["Pizarrete", "Santana"] }
    ]
  },
  {
    "nombre": "Puerto Plata",
    "municipios": [
      { "nombre": "Puerto Plata", "distritos": ["Maimón", "Yásica Arriba"] },
      { "nombre": "Altamira", "distritos": ["Río Grande"] },
      { "nombre": "Guananico", "distritos": [] },
      { "nombre": "Imbert", "distritos": [] },
      { "nombre": "Los Hidalgos", "distritos": ["Navas"] },
      { "nombre": "Luperón", "distritos": ["Belloso", "Estrecho", "La Isabela"] },
      { "nombre": "Sosúa", "distritos": ["Cabarete", "Sabaneta de Yásica"] },
      { "nombre": "Villa Isabela", "distritos": ["Estero Hondo", "Gualete", "La Jaiba"] },
      { "nombre": "Villa Montellano", "distritos": [] }
    ]
  },
  {
    "nombre": "Samaná",
    "municipios": [
      { "nombre": "Samaná", "distritos": ["Arroyo Barril", "El Limón", "Las Galeras"] },
      { "nombre": "Las Terrenas", "distritos": [] },
      { "nombre": "Sánchez", "distritos": [] }
    ]
  },
  {
    "nombre": "San Cristóbal",
    "municipios": [
      { "nombre": "San Cristóbal", "distritos": ["Hato Damas"] },
      { "nombre": "Bajos de Haina", "distritos": ["El Carril"] },
      { "nombre": "Cambita Garabito", "distritos": ["Cambita El Pueblecito"] },
      { "nombre": "Los Cacaos", "distritos": [] },
      { "nombre": "Sabana Grande de Palenque", "distritos": [] },
      { "nombre": "San Gregorio de Nigua", "distritos": [] },
      { "nombre": "Villa Altagracia", "distritos": ["La Cuchilla", "Medina", "San José del Puerto"] },
      { "nombre": "Yaguate", "distritos": [] }
    ]
  },
  {
    "nombre": "San José de Ocoa",
    "municipios": [
      { "nombre": "San José de Ocoa", "distritos": ["El Naranjal", "El Pinar", "La Ciénaga", "Nizao-Las Auyamas"] },
      { "nombre": "Rancho Arriba", "distritos": [] },
      { "nombre": "Sabana Larga", "distritos": [] }
    ]
  },
  {
    "nombre": "San Juan",
    "municipios": [
      { "nombre": "San Juan de la Maguana", "distritos": ["El Rosario", "Guanito", "Hato del Padre", "Hato Nuevo", "La Jagua", "Las Charcas de María Nova", "Pedro Corto", "Sabana Alta", "Sabaneta"] },
      { "nombre": "Bohechío", "distritos": ["Arroyo Cano", "Yaque"] },
      { "nombre": "El Cercado", "distritos": ["Batista", "Derrumbadero"] },
      { "nombre": "Juan de Herrera", "distritos": ["Jínova"] },
      { "nombre": "Las Matas de Farfán", "distritos": ["Carrera de Yegua", "Matayaya"] },
      { "nombre": "Vallejuelo", "distritos": ["Jorjillo"] }
    ]
  },
  {
    "nombre": "San Pedro de Macorís",
    "municipios": [
      { "nombre": "San Pedro de Macorís", "distritos": [] },
      { "nombre": "Consuelo", "distritos": [] },
      { "nombre": "Guayacanes", "distritos": [] },
      { "nombre": "Quisqueya", "distritos": [] },
      { "nombre": "Ramón Santana", "distritos": [] },
      { "nombre": "San José de Los Llanos", "distritos": ["El Puerto", "Gautier"] }
    ]
  },
  {
    "nombre": "Sánchez Ramírez",
    "municipios": [
      { "nombre": "Cotuí", "distritos": ["Caballero", "Comedero Arriba", "Quita Sueño"] },
      { "nombre": "Cevicos", "distritos": ["La Cueva", "Platanal"] },
      { "nombre": "Fantino", "distritos": [] },
      { "nombre": "La Mata", "distritos": ["Angelina", "La Bija", "Hernando Alonzo"] }
    ]
  },
  {
    "nombre": "Santiago",
    "municipios": [
      { "nombre": "Santiago", "distritos": ["Baitoa", "Hato del Yaque", "La Canela", "Pedro García", "San Francisco de Jacagua"] },
      { "nombre": "Bisonó", "distritos": [] },
      { "nombre": "Jánico", "distritos": ["El Caimito", "Juncalito"] },
      { "nombre": "Licey al Medio", "distritos": ["Las Palomas"] },
      { "nombre": "Puñal", "distritos": ["Canabacoa", "Guayabal"] },
      { "nombre": "Sabana Iglesia", "distritos": [] },
      { "nombre": "San José de las Matas", "distritos": ["El Rubio", "La Cuesta", "Las Placetas"] },
      { "nombre": "Tamboril", "distritos": ["Canca La Piedra"] },
      { "nombre": "Villa González", "distritos": ["El Limón", "Palmar Arriba"] }
    ]
  },
  {
    "nombre": "Santiago Rodríguez",
    "municipios": [
      { "nombre": "San Ignacio de Sabaneta", "distritos": [] },
      { "nombre": "Los Almácigos", "distritos": [] },
      { "nombre": "Monción", "distritos": [] }
    ]
  },
  {
    "nombre": "Santo Domingo",
    "municipios": [
      { "nombre": "Santo Domingo Este", "distritos": ["San Luis"] },
      { "nombre": "Boca Chica", "distritos": ["La Caleta"] },
      { "nombre": "Los Alcarrizos", "distritos": ["Palmarejo-Villa Linda", "Pantoja"] },
      { "nombre": "Pedro Brand", "distritos": ["La Cuaba", "La Guáyiga"] },
      { "nombre": "San Antonio de Guerra", "distritos": ["Hato Viejo"] },
      { "nombre": "Santo Domingo Norte", "distritos": ["La Victoria"] },
      { "nombre": "Santo Domingo Oeste", "distritos": [] }
    ]
  },
  {
    "nombre": "Valverde",
    "municipios": [
      { "nombre": "Mao", "distritos": ["Ámina", "Guatapanal", "Jaibón (Pueblo Nuevo)"] },
      { "nombre": "Esperanza", "distritos": ["Boca de Mao", "Jicomé", "Maizal", "Paradero"] },
      { "nombre": "Laguna Salada", "distritos": ["Cruce de Guayacanes", "Jaibón", "La Caya"] }
    ]
  }
];
