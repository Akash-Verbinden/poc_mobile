import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

export default function CommonTable({
  columns = [],
  data = [],
  loading = false,
  totalRows = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  noDataComponent,
}) {
  const totalPages = Math.ceil(totalRows / pageSize) || 1;

  // Calculate explicit total width for all columns combined
  const totalTableWidth = columns.reduce(
    (acc, col) => acc + (col.width || 130),
    0,
  );

  return (
    <View style={styles.container}>
      {/* {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      )} */}

      {/* 1. Outer Horizontal ScrollView */}
      <ScrollView
        horizontal={true}
        bounces={false}
        directionalLockEnabled={true}
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{ width: totalTableWidth }}
      >
        {/* DO NOT put flex: 1 here! It collapses the width back to screen bounds */}
        <View style={{ width: totalTableWidth }}>
          {/* Header Row */}
          <View style={[styles.headerRow, { width: totalTableWidth }]}>
            {columns.map((col, index) => (
              <View
                key={index}
                style={[
                  styles.headerCell,
                  { width: col.width || 130 },
                  col.center && { alignItems: 'center' },
                ]}
              >
                {typeof col.name === 'string' ? (
                  <Text style={styles.headerText}>{col.name}</Text>
                ) : (
                  col.name
                )}
              </View>
            ))}
          </View>

          {/* Rows List */}
          <View style={{ minHeight: 150 }}>
            {data.length > 0 ? (
              data.map((item, index) => (
                <View
                  key={item.id?.toString() || index.toString()}
                  style={[
                    styles.row,
                    { width: totalTableWidth },
                    index % 2 === 1 && styles.stripedRow,
                  ]}
                >
                  {columns.map((col, colIdx) => {
                    const value = col.selector ? col.selector(item) : '';
                    return (
                      <View
                        key={colIdx}
                        style={[
                          styles.cell,
                          { width: col.width || 130 },
                          col.center && { alignItems: 'center' },
                        ]}
                      >
                        {col.cell ? (
                          col.cell(item)
                        ) : (
                          <Text style={styles.cellText} numberOfLines={1}>
                            {value !== undefined && value !== null
                              ? String(value)
                              : ''}
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              ))
            ) : !loading ? (
              <View style={[styles.emptyContainer, { width: totalTableWidth }]}>
                {noDataComponent || (
                  <Text style={styles.emptyText}>No data available</Text>
                )}
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>

      {/* Pagination Footer */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          disabled={page <= 1}
          onPress={() => onPageChange?.(page - 1)}
          style={[styles.pageBtn, page <= 1 && styles.pageBtnDisabled]}
        >
          <Text style={styles.pageBtnText}>Prev</Text>
        </TouchableOpacity>

        <Text style={styles.pageInfoText}>
          Page {page} of {totalPages} ({totalRows} items)
        </Text>

        <TouchableOpacity
          disabled={page >= totalPages}
          onPress={() => onPageChange?.(page + 1)}
          style={[styles.pageBtn, page >= totalPages && styles.pageBtnDisabled]}
        >
          <Text style={styles.pageBtnText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(233, 239, 253, 1)',
    paddingVertical: 12,
    alignItems: 'center',
  },
  headerCell: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    alignItems: 'center',
  },
  stripedRow: {
    backgroundColor: '#f9fafb',
  },
  cell: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 13,
    color: '#374151',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  pageBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2563eb',
    borderRadius: 6,
  },
  pageBtnDisabled: {
    backgroundColor: '#d1d5db',
  },
  pageBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  pageInfoText: {
    fontSize: 12,
    color: '#4b5563',
  },
});
