export interface IBaseResponse<T> {
  status: number;
  error: any;
  message: string;
  data: T;
}


export interface GeoJson {
  type:
    | "Feature"
    | "FeatureCollection"
    | "Point"
    | "LineString"
    | "Polygon"
    | "MultiPoint"
    | "MultiLineString"
    | "MultiPolygon";
  geometry: {
    type: "Point" | "LineString" | "Polygon"; 
    coordinates:
      | [number, number] // Point: [longitude, latitude]
      | [number, number][] // LineString: mảng các điểm
      | [number, number][][]; 
  };
  properties: {
    name?: string; // Tên địa điểm
    address?: string; // Địa chỉ
    city?: string; // Thành phố
    country?: string; // Quốc gia
    postalCode?: string; // Mã bưu điện
    description?: string; // Mô tả thêm
    icon?: string; // URL hoặc tên icon cho bản đồ
    id?: string | number; // ID duy nhất cho feature
    [key: string]: any; // Cho phép mở rộng thuộc tính tùy chỉnh
  };
}
