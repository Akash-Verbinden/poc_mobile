import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function DescriptionText({
  children,
  text,
  highlights = [], 
  style,
  fontSize = 13,
  color = '#334155',
  marginBottom = 12,
}) {
  if (children) {
    return (
      <Text style={[styles.description, { fontSize, color, marginBottom }, style]}>
        {children}
      </Text>
    );
  }

  const renderTextWithHighlights = () => {
    if (!text) return null;
    if (!highlights.length) return text;

    const escapedHighlights = highlights.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escapedHighlights.join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const isHighlighted = highlights.some(
        h => h.toLowerCase() === part.toLowerCase()
      );

      if (isHighlighted) {
        return (
          <Text key={index} style={styles.highlightText}>
            {part}
          </Text>
        );
      }
      return part;
    });
  };

  return (
    <Text style={[styles.description, { fontSize, color, marginBottom }, style]}>
      {renderTextWithHighlights()}
    </Text>
  );
}

const styles = StyleSheet.create({
  description: {
    fontStyle: 'italic',
    lineHeight: 20,
  },
  highlightText: {
    color: '#2563eb',
    fontWeight: '600',
  },
});