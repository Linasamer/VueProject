export class VacationResponse {
  constructor(responseData) {
    this.id = responseData.Identity.Id;
    this.link = responseData._links.self.href;
  }
}
