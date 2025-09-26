# Taipei Scooter Checker 🛵

A comprehensive web application for locating motorcycle emission inspection stations in Taipei, built with modern web technologies and advanced geocoding solutions.

**🚀 Live Demo**: https://lucien-mhl.github.io/taipei-scooter-checker/

## About This Project

This project solves a real-world problem: helping motorcycle owners in Taipei quickly find the nearest emission inspection station. What started as a personal need for my 5+ year old motorcycle became a showcase of full-stack development skills and data processing expertise.

## Key Features

- **Interactive Map Interface** - Built with React-Leaflet and marker clustering
- **Responsive Design** - Seamless experience on desktop and mobile devices
- **Real-time Search** - Instant filtering and location-based results
- **Automated Data Processing** - Self-updating system with government open data API
- **High Availability** - 98.8% successful automated geocoding of all 247 stations

## Technical Highlights

### 🎯 Advanced Geocoding Solution
Achieved **98.8% success rate** in automatically geocoding 247 inspection stations through innovative address formatting strategies:
- Developed comma-separated address format for Taiwan addresses
- Implemented symbol conversion techniques (`-` → `之`)
- Only 3 stations require manual intervention (all in known problematic areas)

### 🛠️ Modern Tech Stack
- **Frontend**: Next.js 15.5.2 with App Router, React 18, TypeScript
- **Styling**: TailwindCSS 4.0 with custom animations
- **State Management**: Zustand for lightweight state handling
- **Maps**: React-Leaflet with MarkerCluster integration
- **Deployment**: GitHub Pages with automated CI/CD

### ⚡ Fully Automated Data Pipeline
- **Source**: Taipei City Government Open Data Platform (247 stations)
- **Processing**: 7-module Node.js pipeline for data transformation
- **Geocoding**: Nominatim API with intelligent fallback strategies
- **Manual Handling**: Smart Issue-based system for failed geocoding cases
- **Auto-deployment**: Automatic GitHub Pages updates after data changes
- **Logging**: Comprehensive execution tracking and failure analysis
- **Updates**: Monthly automated refresh via GitHub Actions

### 🤖 Intelligent Issue Management System
- **Auto-issue Creation**: Automatically creates GitHub Issues for failed geocoding cases
- **TGOS Integration**: Provides direct links to Taiwan's official map service
- **Comment Processing**: Monitors Issue comments for manual coordinate input
- **Smart Validation**: Validates coordinate format and updates data automatically
- **Auto-closure**: Closes Issues and triggers deployment when all coordinates are processed

## Project Impact

This project demonstrates:
- **Problem-solving skills** - Tackled complex geocoding challenges specific to Taiwan addresses
- **Full-stack development** - End-to-end solution from data processing to user interface
- **System design** - Scalable, maintainable architecture with proper error handling
- **DevOps practices** - Automated testing, deployment, and monitoring
- **Real-world application** - Addresses actual user needs with measurable success metrics

## Technical Achievements

- 🏆 **98.8% automation rate** for complex geocoding tasks
- 🤖 **100% automated workflow** with GitHub Actions and Issue management
- 🎯 **Smart data protection** preventing overwrite of manually added coordinates
- 🔄 **End-to-end automation** from data update to deployment
- 🎨 **Pixel-perfect responsive design** with smooth animations
- 🔧 **Robust error handling** ensuring 100% data integrity
- 📊 **Comprehensive logging** for production monitoring
- 🚀 **Modern deployment** with static site generation and CDN delivery

---

*Built with passion for clean code, user experience, and solving real-world problems.*