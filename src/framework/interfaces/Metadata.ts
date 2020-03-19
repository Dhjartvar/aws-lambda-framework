export interface Metadata {
  fieldCount?: number
  affectedRows?: number
  insertId?: number
  info?: string
  serverStatus?: number
  warningStatus?: number
  changedRows?: number
  fields?: FieldDef[]
  command?: string
  oid?: number
  rowCount?: number
}

export interface FieldDef {
  name: string
  tableID: number
  columnID: number
  dataTypeID: number
  dataTypeSize: number
  dataTypeModifier: number
  format: string
}
