export interface Projet {
  projectId?: number; // Optionnel, car il peut être généré côté backend
  name?: string;
  description?: string;
  startDate?: Date;
  endDateProvisioning?: Date;
  endDate?: Date;
//   validationStatuses: string[];
}