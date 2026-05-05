# Movie Database Schema

This directory contains the database schema for the Movie Rating System.

## Files
- `schema.sql`: Complete SQL script to create all tables and relationships in a MySQL database.

## Database Overview
The system uses a relational database to store information about:
1.  **Users**: Authentication and profile data.
2.  **Catalog**: Movies, TV Shows, Genres, and Persons (Actors/Directors).
3.  **Interaction**: User ratings, detailed reviews, and viewing history logs.
4.  **Organization**: Multiple watchlists with priority and status tracking.

## Relationship Diagram (Conceptual)
- **User** 1:N **Watchlist**
- **Watchlist** N:M **Content** (via WatchlistItem)
- **User** 1:N **Rating** / **Review** / **ViewingLog**
- **Content** N:M **Genre**
- **Content** N:M **Person** (as Directors or Cast)
