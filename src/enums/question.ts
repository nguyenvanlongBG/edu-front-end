export enum QuestionType {
  SingleChoice = 1,
  MultiChoice = 2,
  FillResult = 3,
}
export enum QuestionMode {
  ViewOnly = 1, // Chỉ xem không có đáp án
  ViewCanEdit = 2, // Xem
  Edit = 3,
  Do = 4,
  History = 5,
}
export enum QuestionLevel {
  Recognition = 1, // Nhận biết
  Comprehension = 2, // Thông hiểu
  Application = 3, // Vận dụng
  AdvancedApplication = 4, // Vận dụng cao
}
