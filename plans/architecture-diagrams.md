# Movie Rating System - Architecture Diagrams

## System Overview

### High-Level Architecture
```mermaid
graph TB
    subgraph "Client Layer"
        Web[Web Browser]
        Mobile[Mobile Browser]
    end
    
    subgraph "Presentation Layer"
        Frontend[Frontend App<br/>React/Next.js]
        CDN[CDN/Static Assets]
    end
    
    subgraph "Application Layer"
        API[Backend API<br/>Node.js/Express]
        Auth[Auth Service]
        Search[Search Service]
        Rec[Recommendation Service]
    end
    
    subgraph "Data Layer"
        DB[(PostgreSQL<br/>Primary Database)]
        Cache[(Redis Cache)]
        SearchDB[(ElasticSearch)]
    end
    
    subgraph "Infrastructure"
        Docker[Docker Containers]
        K8s[Kubernetes]
        CI[CI/CD Pipeline]
    end
    
    Web --> Frontend
    Mobile --> Frontend
    Frontend --> API
    API --> Auth
    API --> Search
    API --> Rec
    Auth --> DB
    API --> DB
    API --> Cache
    Search --> SearchDB
    Docker --> API
    Docker --> Frontend
    CI --> Docker
```

## Database Schema

### Core Entities Relationship
```mermaid
erDiagram
    User ||--o{ Session : has
    User ||--o{ Profile : has
    User ||--o{ Watchlist : creates
    User ||--o{ ViewingLog : creates
    User ||--o{ Rating : creates
    User ||--o{ Friend : connects
    
    Content ||--o{ WatchlistItem : appears_in
    Content ||--o{ ViewingLog : watched_in
    Content ||--o{ Rating : rated_in
    Content ||--o{ Genre : belongs_to
    
    Watchlist ||--o{ WatchlistItem : contains
    WatchlistItem }|--|| Priority : has
    
    StreamingPlatform ||--o{ Availability : provides
    Content ||--o{ Availability : available_on
    
    User ||--o{ Activity : generates
    Activity ||--|| ActivityType : of_type
```

## Component Architecture

### Frontend Component Hierarchy
```mermaid
graph TD
    App[App Component] --> Layout[Main Layout]
    
    Layout --> Nav[Navigation]
    Layout --> Routes[Route Container]
    
    Routes --> Public[Public Routes]
    Routes --> Private[Private Routes]
    
    Public --> Login[Login Page]
    Public --> Register[Register Page]
    Public --> Home[Home Page]
    
    Private --> Dashboard[Dashboard]
    Private --> Catalog[Content Catalog]
    Private --> Watchlist[Watchlist Manager]
    Private --> History[Viewing History]
    Private --> Search[Search & Discovery]
    Private --> Stats[Personal Statistics]
    Private --> Social[Social Features]
    
    Dashboard --> Widgets[Dashboard Widgets]
    Catalog --> ContentCard[Content Card]
    Catalog --> ContentForm[Content Form]
    Watchlist --> WatchlistItem[Watchlist Item]
    Watchlist --> PrioritySelector[Priority Selector]
    History --> RatingComponent[Rating Component]
    History --> ReviewEditor[Review Editor]
    Search --> FilterPanel[Filter Panel]
    Search --> ResultsGrid[Results Grid]
    Stats --> Charts[Chart Components]
    Social --> ActivityFeed[Activity Feed]
    Social --> FriendList[Friend List]
```

## Deployment Architecture

### Docker Compose Setup
```mermaid
graph TB
    subgraph "Docker Compose Services"
        FrontendService[frontend:3000<br/>React App]
        BackendService[backend:5000<br/>Node.js API]
        DatabaseService[database:5432<br/>PostgreSQL]
        CacheService[cache:6379<br/>Redis]
        SearchService[search:9200<br/>ElasticSearch]
        NginxService[nginx:80<br/>Reverse Proxy]
    end
    
    Internet --> NginxService
    NginxService --> FrontendService
    NginxService --> BackendService
    BackendService --> DatabaseService
    BackendService --> CacheService
    BackendService --> SearchService
    FrontendService --> BackendService
```

## API Layer Architecture

### REST API Structure
```mermaid
graph LR
    subgraph "API Gateway"
        Gateway[API Gateway<br/>/api/*]
    end
    
    subgraph "API Modules"
        AuthModule[Auth Module<br/>/api/auth/*]
        UsersModule[Users Module<br/>/api/users/*]
        ContentModule[Content Module<br/>/api/content/*]
        WatchlistModule[Watchlist Module<br/>/api/watchlists/*]
        HistoryModule[History Module<br/>/api/history/*]
        SearchModule[Search Module<br/>/api/search/*]
        StatsModule[Stats Module<br/>/api/stats/*]
        SocialModule[Social Module<br/>/api/social/*]
        PlatformModule[Platform Module<br/>/api/platforms/*]
    end
    
    Gateway --> AuthModule
    Gateway --> UsersModule
    Gateway --> ContentModule
    Gateway --> WatchlistModule
    Gateway --> HistoryModule
    Gateway --> SearchModule
    Gateway --> StatsModule
    Gateway --> SocialModule
    Gateway --> PlatformModule
```

## Data Flow Diagrams

### User Registration Flow
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant DB as Database
    participant E as Email Service
    
    U->>F: Fill registration form
    F->>A: POST /api/users/register
    A->>DB: Validate unique email
    DB-->>A: Email available
    A->>DB: Create user record
    A->>E: Send verification email
    A-->>F: 201 Created + user data
    F-->>U: Registration success message
    U->>E: Click verification link
    E->>A: Verify token
    A->>DB: Mark email as verified
    A-->>U: Account activated
```

### Content Search Flow
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant C as Cache
    participant S as Search Index
    participant DB as Database
    
    U->>F: Enter search query + filters
    F->>A: GET /api/search?q=query&filters
    A->>C: Check cache for query
    alt Cache Hit
        C-->>A: Return cached results
    else Cache Miss
        A->>S: Search index
        S-->>A: Return document IDs
        A->>DB: Fetch full content details
        DB-->>A: Return content data
        A->>C: Cache results
    end
    A-->>F: Return search results
    F-->>U: Display results
```

## Testing Architecture

### Test Pyramid Implementation
```mermaid
graph TD
    subgraph "Test Pyramid"
        E2E[E2E Tests<br/>10% - Cypress]
        Integration[Integration Tests<br/>20% - Jest/Supertest]
        Unit[Unit Tests<br/>70% - Jest]
    end
    
    subgraph "Test Categories"
        FrontendTests[Frontend Tests]
        BackendTests[Backend Tests]
        APITests[API Contract Tests]
        DatabaseTests[Database Tests]
    end
    
    Unit --> FrontendTests
    Unit --> BackendTests
    Integration --> APITests
    Integration --> DatabaseTests
    E2E --> UserFlows[User Flow Tests]
    
    subgraph "CI/CD Pipeline"
        PR[Pull Request]
        Build[Build & Test]
        Deploy[Deploy to Staging]
        Production[Production Deployment]
    end
    
    PR --> Build
    Build --> Unit
    Build --> Integration
    Build --> E2E
    Build --> Deploy
    Deploy --> Production
```

## Security Architecture

### Authentication & Authorization Flow
```mermaid
graph TB
    subgraph "Authentication"
        Login[User Login]
        Token[JWT Token Generation]
        Validation[Token Validation]
        Refresh[Token Refresh]
    end
    
    subgraph "Authorization"
        RBAC[Role-Based Access Control]
        Permissions[Permission Checks]
        ResourceGuard[Resource Guards]
    end
    
    subgraph "Security Layers"
        HTTPS[HTTPS Encryption]
        RateLimit[Rate Limiting]
        InputValidation[Input Validation]
        SQLInjection[SQL Injection Prevention]
        XSS[XSS Protection]
    end
    
    Login --> Token
    Token --> Validation
    Validation --> RBAC
    RBAC --> Permissions
    Permissions --> ResourceGuard
    
    HTTPS --> Login
    RateLimit --> Validation
    InputValidation --> Login
    SQLInjection --> Database
    XSS --> Frontend
```

## Monitoring & Observability

### Monitoring Stack
```mermaid
graph LR
    subgraph "Application"
        AppLogs[Application Logs]
        Metrics[Application Metrics]
        Traces[Distributed Traces]
    end
    
    subgraph "Infrastructure"
        ContainerMetrics[Container Metrics]
        HostMetrics[Host Metrics]
        NetworkMetrics[Network Metrics]
    end
    
    subgraph "Monitoring Tools"
        LogAgg[Log Aggregator<br/>ELK Stack]
        MetricsDB[Metrics Database<br/>Prometheus]
        Tracing[Tracing System<br/>Jaeger]
        Alerting[Alert Manager]
        Dashboard[Grafana Dashboard]
    end
    
    AppLogs --> LogAgg
    Metrics --> MetricsDB
    Traces --> Tracing
    ContainerMetrics --> MetricsDB
    HostMetrics --> MetricsDB
    NetworkMetrics --> MetricsDB
    
    LogAgg --> Dashboard
    MetricsDB --> Dashboard
    Tracing --> Dashboard
    MetricsDB --> Alerting
```

This architecture provides a scalable, maintainable foundation for the Movie Rating System with clear separation of concerns, comprehensive testing strategy, and production-ready deployment configuration.