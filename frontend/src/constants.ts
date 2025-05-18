export const Constants = {
  API: "https://z4imay50hc.execute-api.us-east-2.amazonaws.com/api",
  FILE_FORMATS: [
    "application/pdf",
    "application/zip",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/png",
    "image/vnd.dwg",
    "image/vnd.dxf",
    "application/x-tgif",
    "application/octet-stream",
    "model/x3d+xml",
  ],
  MAX_FILE_SIZE: 5242880, //mb
  FILE_EXTENSIONS: ".pdf,.dwg,.dxf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.skp,.rvt,.rfa,.rte,.pln,.tpl,.gsm,.ifc,.zip",
};
