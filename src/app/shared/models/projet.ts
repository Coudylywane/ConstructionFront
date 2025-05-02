export interface Projet {
  id?: number; // Optionnel, car il peut être généré côté backend
  name?: string;
  description?: string;
  startDate?: Date;
  endDateProvisioning?: Date;
  endDate?: Date;
  status?: string;
  clientId?: number;

  //   validationStatuses: string[];
}

export interface Validation {
  id?: number; // Optionnel, car il peut être généré côté backend
  status?: string;
  
}