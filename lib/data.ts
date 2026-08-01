export type Vehicle = {
  id: string;
  nickname: string;
  make: string;
  model: string;
  year: number;
  plate: string;
};

export type MaintenanceRecord = {
  id: string;
  vehicleId: string;
  type: string;
  date: string;
  mileage: number;
  notes?: string;
};

export let vehicles: Vehicle[] = [
  {
    id: '1',
    nickname: 'The Beast',
    make: 'Toyota',
    model: 'Tacoma',
    year: 2018,
    plate: 'ABC123'
  },
  {
    id: '2',
    nickname: 'Old Reliable',
    make: 'Honda',
    model: 'Civic',
    year: 2012,
    plate: 'DEF456'
  },
  {
    id: '3',
    nickname: 'Snow Plow',
    make: 'Ford',
    model: 'F-150',
    year: 2021,
    plate: 'HIJ150'
  },
];

export let maintenanceRecords: MaintenanceRecord[] = [
  {
    id: '1',
    vehicleId: '1',
    type: 'Oil Change',
    date: '2026-01-15',
    mileage: 42000,
    notes: 'Synthetic 5W-30',
  },
  {
    id: '2',
    vehicleId: '1',
    type: 'Tire Rotation',
    date: '2026-03-10',
    mileage: 45500,
  },
  {
    id: '3',
    vehicleId: '2',
    type: 'Brake Pads',
    date: '2025-11-02',
    mileage: 98000,
    notes: 'Replaced front pads and rotors',
  },
];
