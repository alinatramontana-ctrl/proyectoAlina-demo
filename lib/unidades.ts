export type PlantaUnidad = 0 | 1 | 2 | 3;
export type EstadoUnidad = "Disponible" | "Reservado" | "Vendido";
export type TipoUnidad = "Local" | "Monoambiente" | "1 dorm";

export type Unidad = {
  id: string;
  nombre: string;

  planta: PlantaUnidad;
  tipo: TipoUnidad;

  m2: number;
  dorm: number;
  banos: number;
  frente: boolean;

  estado: EstadoUnidad;
  precio: string; // "Consultar precio" o "USD ..."
};

export const UNIDADES: Unidad[] = [
  {
    id: "L1",
    nombre: "Local 1",
    planta: 0,
    tipo: "Local",
    m2: 18,
    dorm: 0,
    banos: 1,
    frente: true,
    estado: "Disponible",
    precio: "Consultar precio",
  },
  {
    id: "L2",
    nombre: "Local 2",
    planta: 0,
    tipo: "Local",
    m2: 20,
    dorm: 0,
    banos: 1,
    frente: true,
    estado: "Disponible",
    precio: "Consultar precio",
  },
  {
    id: "1A",
    nombre: "Unidad 1A",
    planta: 1,
    tipo: "Monoambiente",
    m2: 30,
    dorm: 0,
    banos: 1,
    frente: true,
    estado: "Disponible",
    precio: "Consultar precio",
  },
  {
    id: "1B",
    nombre: "Unidad 1B",
    planta: 1,
    tipo: "Monoambiente",
    m2: 30,
    dorm: 0,
    banos: 1,
    frente: true,
    estado: "Disponible",
    precio: "Consultar precio",
  },
  {
    id: "2A",
    nombre: "Unidad 2A",
    planta: 2,
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
    planta: 2,
    tipo: "1 dorm",
    m2: 40,
    dorm: 1,
    banos: 1,
    frente: true,
    estado: "Disponible",
    precio: "Consultar precio",
  },
    {
    id: "3A",
    nombre: "Unidad 3A",
    planta: 3,
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
    planta: 3,
    tipo: "1 dorm",
    m2: 40,
    dorm: 1,
    banos: 1,
    frente: true,
    estado: "Disponible",
    precio: "Consultar precio",
  },

];
