export interface CarAPIResponse {
  Count: number;
  Message: string;
  SearchCriteria: string;
  Results: CarAPIResult[];
}

export interface CarAPIResult {
  Make_ID: number;
  Make_Name: string;
  Model_ID: number;
  Model_Name: string;
}
