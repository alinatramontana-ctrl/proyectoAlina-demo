export type PisoId = "azotea" | "3" | "2" | "1" | "pb";

export type Hotspot = {
  id: string;        // ej: "1A"
  nombre: string;    // ej: "Unidad 1A"
  pisoId: PisoId;

  // Posición en % dentro del plano (más fácil de ajustar)
  x: number; // 0 a 100
  y: number; // 0 a 100

  // Datos para el “mini detalle”
  tipo: string;
  m2: number;
  dorm: number;
  banos: number;
  frente: boolean;
  estado: "Disponible" | "Reservado" | "Vendido";
  precio: string;
};

// Hotspots DEMO (después ajustamos x/y mirando tu plano real)
export const HOTSPOTS: Hotspot[] = [
  // PB
  {
    id: "L1",
    nombre: "Local 1",
    pisoId: "pb",
    x: 25,
    y: 60,
    tipo: "Local",
    m2: 18,
    dorm: 0,
    banos: 0,
    frente: true,
    estado: "Disponible",
    precio: "Consultar precio",
  },
  {
    id: "L2",
    nombre: "Local 2",
    pisoId: "pb",
    x: 65,
    y: 60,
    tipo: "Local",
    m2: 20,
    dorm: 0,
    banos: 0,
    frente: true,
    estado: "Disponible",
    precio: "Consultar precio",
  },

  // 1er Piso
  {
    id: "1A",
    nombre: "Unidad 1A",
    pisoId: "1",
    x: 30,
    y: 55,
    tipo: "Monoambiente",
    m2: 33,
    dorm: 0,
    banos: 1,
    frente: true,
    estado: "Disponible",
    precio: "Consultar precio",
  },
  {
    id: "1B",
    nombre: "Unidad 1B",
    pisoId: "1",
    x: 70,
    y: 55,
    tipo: "Monoambiente",
    m2: 33,
    dorm: 0,
    banos: 1,
    frente: true,
    estado: "Disponible",
    precio: "Consultar precio",
  },

  // 2do Piso
  {
    id: "2A",
    nombre: "Unidad 2A",
    pisoId: "2",
    x: 30,
    y: 55,
    tipo: "1 dorm",
    m2: 45,
    dorm: 1,
    banos: 1,
    frente: true,
    estado: "Disponible",
    precio: "Consultar precio",
  },
  {
    id: "2B",
    nombre: "Unidad 2B",
    pisoId: "2",
    x: 70,
    y: 55,
    tipo: "1 dorm",
    m2: 40,
    dorm: 1,
    banos: 1,
    frente: true,
    estado: "Disponible",
    precio: "Consultar precio",
  },

  // 3er Piso
  {
    id: "3A",
    nombre: "Unidad 3A",
    pisoId: "3",
    x: 30,
    y: 55,
    tipo: "1 dorm",
    m2: 45,
    dorm: 1,
    banos: 1,
    frente: true,
    estado: "Disponible",
    precio: "Consultar precio",
  },
  {
    id: "3B",
    nombre: "Unidad 3B",
    pisoId: "3",
    x: 70,
    y: 55,
    tipo: "1 dorm",
    m2: 40,
    dorm: 1,
    banos: 1,
    frente: true,
    estado: "Disponible",
    precio: "Consultar precio",
  },
];
