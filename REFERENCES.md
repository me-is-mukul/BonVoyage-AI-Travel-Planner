# Project References

This document contains references to all libraries, frameworks, and technologies used in the Bon Voyage project.

## Python & Backend

### Web Framework
- **Flask** (v3.1.3) - Python web framework for building the REST API
  - https://flask.palletsprojects.com/

### Machine Learning & Deep Learning
- **TensorFlow** (v2.21.0) - Machine learning framework
  - https://www.tensorflow.org/

- **Keras** (v3.14.0) - Deep learning API
  - https://keras.io/

- **Scikit-learn** (v1.8.0) - Machine learning library
  - https://scikit-learn.org/

- **Imbalanced-learn** (v0.12.3) - Tools for handling imbalanced datasets (SMOTE)
  - https://imbalanced-learn.org/

### Data Processing & Manipulation
- **Pandas** (v3.0.2) - Data manipulation and analysis
  - https://pandas.pydata.org/

- **NumPy** (v2.4.4) - Numerical computing library
  - https://numpy.org/

### Computer Vision
- **OpenCV** (v4.13.0.92) - Open source computer vision library
  - https://opencv.org/

### Data Serialization
- **Pickle** - Python object serialization (standard library)
  - https://docs.python.org/3/library/pickle.html

### Production Server
- **Gunicorn** (v21.2.0) - WSGI HTTP Server for running Flask in production
  - https://gunicorn.org/

### Environment Management
- **python-dotenv** (v1.0.0) - Load environment variables from .env file
  - https://github.com/theskumar/python-dotenv

### Other Python Libraries
- **Requests** (v2.33.1) - HTTP library for Python
- **Werkzeug** (v3.1.8) - WSGI utilities and exceptions
- **Jinja2** (v3.1.6) - Template engine
- **python-dateutil** (v2.9.0) - Date and time utilities

---

## Frontend & UI

### Core Framework
- **React** (v19.2.5) - JavaScript library for building user interfaces
  - https://react.dev/

- **React DOM** (v19.2.5) - React package for DOM manipulation
  - https://react.dev/reference/react-dom

### Language & Type Safety
- **TypeScript** (~v6.0.2) - Typed superset of JavaScript
  - https://www.typescriptlang.org/

### Styling
- **Tailwind CSS** (v4.2.4) - Utility-first CSS framework
  - https://tailwindcss.com/

- **@tailwindcss/vite** (v4.2.4) - Vite plugin for Tailwind CSS
  - https://tailwindcss.com/docs/installation

### Build Tool
- **Vite** (v8.0.10) - Frontend build tool and development server
  - https://vitejs.dev/

### Routing
- **React Router DOM** (v7.14.2) - Client-side routing library for React
  - https://reactrouter.com/

### 3D Graphics & Visualization
- **Three.js** (v0.184.0) - JavaScript 3D library
  - https://threejs.org/

- **react-globe.gl** (v2.37.1) - React component for 3D globe visualization
  - https://github.com/vasturiano/react-globe.gl

- **@types/three** (v0.184.0) - TypeScript type definitions for Three.js
  - https://www.npmjs.com/package/@types/three

### File Handling
- **jszip** (v3.10.1) - JavaScript ZIP file creation and manipulation
  - https://stuk.github.io/jszip/

### Code Quality
- **ESLint** (v10.2.1) - JavaScript linter
  - https://eslint.org/

- **typescript-eslint** (v8.58.2) - ESLint configuration for TypeScript
  - https://typescript-eslint.io/

- **eslint-plugin-react-hooks** (v7.1.1) - ESLint rules for React Hooks
  - https://www.npmjs.com/package/eslint-plugin-react-hooks

---

## DevOps & Deployment

### Containerization
- **Docker** - Container platform
  - https://www.docker.com/

- **Docker Compose** - Multi-container orchestration
  - https://docs.docker.com/compose/

### Deployment Platform
- **Render** - Cloud platform for hosting web applications
  - https://render.com/

### Operating Systems Supported
- **Windows** (10+)
- **macOS** (10.15+)
- **Linux** (Ubuntu 18.04+, etc.)

---

## Database & Data Storage

### Datasets Used
- Travel personality classification dataset (custom survey responses)
- City characteristics and vectors (pre-processed)
- Travel and tourism data
- Itinerary and activity recommendations

### Data Formats
- **JSON** - For model embeddings and configuration
- **CSV** - For training datasets
- **Keras Model Format** (.keras) - For CNN model
- **Pickle** (.pkl) - For serialized Python models

---

## Machine Learning Algorithms

### Model 1: Travel Personality Classification
- **Algorithm:** Support Vector Machine (SVM)
- **Implementation:** scikit-learn SVC
- **Data Preprocessing:** StandardScaler normalization
- **Class Balancing:** SMOTE (Synthetic Minority Over-sampling)
- **Label Encoding:** LabelEncoder for categorical outputs

### Model 2: City Recommendation
- **Algorithm:** Cosine Similarity
- **Vector Representation:** TF-IDF vectors
- **Implementation:** scikit-learn cosine_similarity
- **Features:** Zone, state, and city-level embeddings

### Model 3: Itinerary Generation
- **Algorithm:** Multi-factor scoring with cosine similarity
- **Features:** Activity categories, time matching, user preferences
- **Constraints:** Duration, activity balance, time availability

### Model 4: CNN - Day/Night Classification
- **Architecture:** Convolutional Neural Network (CNN)
- **Framework:** Keras (with TensorFlow backend)
- **Input:** RGB images
- **Output:** Binary classification (Day/Night)
- **Training:** Custom dataset of travel photos

---

## Additional Tools & Services

### Development Tools
- **Git** - Version control
- **VS Code** - Code editor with extensions
- **npm/Node.js** - JavaScript package manager and runtime

### Google Cloud Services (Optional)
- **Google Maps API** - For place cards and location data (optional, for enhanced UI)
  - https://developers.google.com/maps
- **Places API** - For fetching place information
  - https://developers.google.com/maps/documentation/places

---

## Documentation & Standards

- **REST API** - RESTful API design principles
- **CORS** - Cross-Origin Resource Sharing
- **JSON** - Data interchange format

---

## Version Information

- **Python:** 3.11
- **Node.js:** 20.x (for frontend build)
- **npm:** 10.x+

---

## License Notes

This project uses open-source libraries under various licenses:
- MIT
- Apache 2.0
- BSD
- GNU GPL

Please refer to individual package licenses for detailed terms.

---

## Citation Format

For academic or research purposes, cite libraries as follows:

### TensorFlow
> Abadi, M., et al. (2015). TensorFlow: Large-Scale Machine Learning on Heterogeneous Systems. https://www.tensorflow.org/

### Scikit-learn
> Pedregosa, F., et al. (2011). Scikit-learn: Machine Learning in Python. Journal of Machine Learning Research, 12, 2825-2830.

### React
> The React Core Team. (2023). React: A JavaScript library for building user interfaces. https://react.dev/

### Keras
> Chollet, François, et al. Keras. https://keras.io

---

**Last Updated:** May 2026
**Project:** Bon Voyage - AI-Powered Travel Recommendation Platform
