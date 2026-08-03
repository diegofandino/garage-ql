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
  }
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
  }
];
