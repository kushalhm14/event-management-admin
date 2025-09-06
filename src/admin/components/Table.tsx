import React, { useState } from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { DataTable, Checkbox, Button } from 'react-native-paper';
import { TableProps, TableColumn } from '../../types/admin';

interface TableState {
  selectedRows: any[];
  page: number;
  numberOfItemsPerPageList: number[];
  itemsPerPage: number;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  renderCell,
  onRowSelect,
  selectable = false,
  pagination = false,
}) => {
  const [state, setState] = useState<TableState>({
    selectedRows: [],
    page: 0,
    numberOfItemsPerPageList: [5, 10, 20],
    itemsPerPage: 10,
  });

  const from = state.page * state.itemsPerPage;
  const to = Math.min((state.page + 1) * state.itemsPerPage, data.length);
  const paginatedData = pagination ? data.slice(from, to) : data;

  const handleSelectRow = (row: any, isSelected: boolean) => {
    const newSelected = isSelected
      ? [...state.selectedRows, row]
      : state.selectedRows.filter(selectedRow => selectedRow.id !== row.id);
    
    setState(prev => ({ ...prev, selectedRows: newSelected }));
    onRowSelect?.(newSelected);
  };

  const handleSelectAll = (isSelected: boolean) => {
    const newSelected = isSelected ? [...paginatedData] : [];
    setState(prev => ({ ...prev, selectedRows: newSelected }));
    onRowSelect?.(newSelected);
  };

  const isRowSelected = (row: any) => {
    return state.selectedRows.some(selectedRow => selectedRow.id === row.id);
  };

  const isAllSelected = state.selectedRows.length === paginatedData.length && paginatedData.length > 0;
  const isIndeterminate = state.selectedRows.length > 0 && state.selectedRows.length < paginatedData.length;

  if (Platform.OS === 'web') {
    // Web-optimized table layout
    return (
      <View style={{ flex: 1 }}>
        <ScrollView horizontal>
          <DataTable>
            <DataTable.Header>
              {selectable && (
                <DataTable.Title style={{ width: 50 }}>
                  <Checkbox
                    status={isAllSelected ? 'checked' : isIndeterminate ? 'indeterminate' : 'unchecked'}
                    onPress={() => handleSelectAll(!isAllSelected)}
                  />
                </DataTable.Title>
              )}
              {columns.map((column) => (
                <DataTable.Title 
                  key={column.key}
                  style={{ width: typeof column.width === 'number' ? column.width : 150 }}
                >
                  {column.label}
                </DataTable.Title>
              ))}
            </DataTable.Header>

            {paginatedData.map((row, index) => (
              <DataTable.Row key={row.id || index}>
                {selectable && (
                  <DataTable.Cell style={{ width: 50 }}>
                    <Checkbox
                      status={isRowSelected(row) ? 'checked' : 'unchecked'}
                      onPress={() => handleSelectRow(row, !isRowSelected(row))}
                    />
                  </DataTable.Cell>
                )}
                {columns.map((column) => (
                  <DataTable.Cell 
                    key={column.key}
                    style={{ width: typeof column.width === 'number' ? column.width : 150 }}
                  >
                    {renderCell ? renderCell(row, column.key) : row[column.key]}
                  </DataTable.Cell>
                ))}
              </DataTable.Row>
            ))}

            {pagination && (
              <DataTable.Pagination
                page={state.page}
                numberOfPages={Math.ceil(data.length / state.itemsPerPage)}
                onPageChange={(page) => setState(prev => ({ ...prev, page }))}
                label={`${from + 1}-${to} of ${data.length}`}
                numberOfItemsPerPageList={state.numberOfItemsPerPageList}
                numberOfItemsPerPage={state.itemsPerPage}
                onItemsPerPageChange={(itemsPerPage) =>
                  setState(prev => ({ ...prev, itemsPerPage, page: 0 }))
                }
                showFastPaginationControls
                selectPageDropdownLabel="Rows per page"
              />
            )}
          </DataTable>
        </ScrollView>
      </View>
    );
  }

  // Mobile-optimized list layout
  return (
    <ScrollView style={{ flex: 1 }}>
      {paginatedData.map((row, index) => (
        <View 
          key={row.id || index}
          style={{
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#e0e0e0',
            backgroundColor: 'white',
          }}
        >
          {selectable && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Checkbox
                status={isRowSelected(row) ? 'checked' : 'unchecked'}
                onPress={() => handleSelectRow(row, !isRowSelected(row))}
              />
              <Text style={{ marginLeft: 8, fontWeight: 'bold' }}>Select</Text>
            </View>
          )}
          
          {columns.map((column) => (
            <View key={column.key} style={{ marginBottom: 4 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#666' }}>
                {column.label}:
              </Text>
              <Text style={{ fontSize: 14 }}>
                {renderCell ? renderCell(row, column.key) : row[column.key]}
              </Text>
            </View>
          ))}
        </View>
      ))}
      
      {pagination && (
        <View style={{ padding: 16, alignItems: 'center' }}>
          <Text style={{ marginBottom: 8 }}>
            {from + 1}-{to} of {data.length}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button
              mode="outlined"
              onPress={() => setState(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))}
              disabled={state.page === 0}
            >
              Previous
            </Button>
            <Button
              mode="outlined"
              onPress={() => setState(prev => ({ 
                ...prev, 
                page: Math.min(Math.ceil(data.length / prev.itemsPerPage) - 1, prev.page + 1) 
              }))}
              disabled={to >= data.length}
            >
              Next
            </Button>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default Table;
