import type React from "react"

interface Column {
  key: string
  label: string
  render?: (item: any) => React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: any[]
}

export default function DataTable({ columns, data }: DataTableProps) {
  return (
    <div className="tactical-card shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b-2 border-primary/30 bg-card">
              {columns.map((column) => (
                <th key={column.key} className="text-left px-6 py-3 font-bold text-muted-foreground uppercase tracking-wider">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b border-border hover:bg-primary/5 transition-colors">
                {columns.map((column) => (
                  <td key={`${index}-${column.key}`} className="px-6 py-4 text-foreground">
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
