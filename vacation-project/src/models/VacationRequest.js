export class VacationRequest {
    constructor(startDate, endDate, type) {
      this.startDate = startDate;
      this.endDate = endDate;
      this.type = type;
      this.numDays = this.calculateNumberOfDays(startDate, endDate);
    }
  
    calculateNumberOfDays(startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
  
    toJSON() {
      return {
        Properties: {
          StartDate: this.startDate,
          EndDate: this.endDate,
          Type: this.type,
          NumberOfDays: this.numDays,
        },
      };
    }
  }
  