import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      brightness: Brightness.light,
      primaryColor: const Color(0xFF198754), // Verde IFPR
      scaffoldBackgroundColor: const Color(0xFFEFF3F6),
      appBarTheme: const AppBarTheme(
        backgroundColor: Color(0xFF198754),
        foregroundColor: Colors.white,
        centerTitle: true,
        elevation: 0,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          foregroundColor: Colors.white,
          textStyle: const TextStyle(fontWeight: FontWeight.bold),
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 24),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      ),
      textTheme: const TextTheme(
        bodyMedium: TextStyle(fontSize: 16),
        titleLarge: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF198754)),
      ),
      cardTheme: CardTheme(
        elevation: 4,
        color: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        shadowColor: Colors.black26,
      ),
    );
  }
}
