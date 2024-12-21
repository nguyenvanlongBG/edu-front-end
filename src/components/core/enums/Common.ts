export enum ActionEditor {
  INSERT = 1,
  EDIT = 2,
}
export enum FilterOperator {
  /// <summary>
  /// Bằng (=).
  /// </summary>
  Equal,

  /// <summary>
  /// Không bằng (<>).
  /// </summary>
  NotEqual,

  /// <summary>
  /// Lớn hơn (>).
  /// </summary>
  GreaterThan,

  /// <summary>
  /// Nhỏ hơn (<).
  /// </summary>
  LessThan,

  /// <summary>
  /// Lớn hơn hoặc bằng (>=).
  /// </summary>
  GreaterThanOrEqual,

  /// <summary>
  /// Nhỏ hơn hoặc bằng (<=).
  /// </summary>
  LessThanOrEqual,

  /// <summary>
  /// Chứa (LIKE).
  /// </summary>
  Contains,

  /// <summary>
  /// Bắt đầu bằng (LIKE "abc%").
  /// </summary>
  StartsWith,

  /// <summary>
  /// Kết thúc bằng (LIKE "%abc").
  /// </summary>
  EndsWith,

  /// <summary>
  /// Trong danh sách (IN).
  /// </summary>
  In,
}
export enum ComboboxMode {
  Local = 1,
  Remote = 2,
}
export enum InputLabel {
  Vertical = 1,
  Horizontal = 2,
}
export enum LoadingType {
  Skeleton = 1,
  LoadingNormal = 2,
}
