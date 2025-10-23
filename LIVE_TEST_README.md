# Live Test Page - Documentation

## Overview

La página de **Live Test** permite a los usuarios probar el sistema de detección de fraude multi-agente en tiempo real. Actualmente utiliza datos mock en formato JSON para simular las respuestas de la API.

## Características Implementadas

### 1. Formulario de Entrada de Transacción
- 10 campos para ingresar datos completos de una transacción:
  - User ID (requerido)
  - Amount (requerido)
  - User Age (days)
  - Total Transactions
  - Time (HH:MM)
  - Merchant
  - Merchant Rating (0-5)
  - Merchant Fraud Reports
  - Location
  - Previous Location

### 2. Ejemplos Rápidos
Dos transacciones de ejemplo pre-configuradas:

**Ejemplo 1: Transacción Fraudulenta (sketchy_alice)**
- Usuario nuevo (8 días)
- Primera transacción de $7,500
- Merchant sospechoso (rating 2.1, 23 reportes de fraude)
- Cambio de ubicación drástico (California → Nigeria)
- Hora sospechosa (3:45 AM)
- **Resultado esperado: DECLINE**

**Ejemplo 2: Transacción Legítima (john_verified)**
- Usuario establecido (1,250 días)
- 456 transacciones previas
- Monto moderado ($180)
- Merchant confiable (Amazon, rating 4.8)
- Ubicación consistente (New York)
- **Resultado esperado: APPROVE**

### 3. Selector de Modo ACE
Tres modos disponibles (interfaz lista, lógica pendiente):
- **Vanilla Agent**: Sin aprendizaje, rendimiento base
- **Offline ACE**: Pre-entrenado con datos históricos
- **Online ACE**: Aprendizaje en tiempo real (seleccionado por defecto)

### 4. Visualización de Resultados

#### Decisión Final
- Badge grande con APPROVE ✅ o DECLINE ⛔
- Porcentaje de confianza
- Risk Score (0-100)
- Explicación detallada del razonamiento

#### Barra de Scores de Agentes
Visualización horizontal de scores por agente:
- Código de colores:
  - 🟢 Verde: 0-25 (bajo riesgo)
  - 🟡 Amarillo: 25-50 (riesgo medio-bajo)
  - 🟠 Naranja: 50-75 (riesgo medio-alto)
  - 🔴 Rojo: 75-100 (alto riesgo)
- Animación suave al mostrar resultados
- Recomendación del agente (APPROVE/DECLINE)

#### Tarjetas Detalladas de Agentes
Grid de 5 tarjetas (2x3) mostrando cada agente:

**🔍 PatternDetector**
- Detecta patrones sospechosos en transacciones

**🧠 BehavioralAnalyzer**
- Analiza comportamiento del usuario

**⚡ VelocityChecker**
- Verifica velocidad de transacciones

**🏪 MerchantRiskAnalyzer**
- Evalúa riesgo del comerciante

**🌍 GeographicAnalyzer**
- Analiza ubicación geográfica

Cada tarjeta muestra:
- Icono del agente
- Risk Score
- Nivel de confianza
- Recomendación
- Análisis detallado
- Key Findings (lista de hallazgos)

## Datos Mock

### Estructura de Respuesta Mock

```json
{
  "transaction": { ...datos de la transacción... },
  "decision": "APPROVE" | "DECLINE",
  "confidence": 0.92,
  "risk_score": 87.5,
  "reasoning": "Explicación detallada...",
  "analyzer_results": {
    "PatternDetector": {
      "name": "PatternDetector",
      "risk_score": 85,
      "findings": ["Finding 1", "Finding 2"],
      "recommendation": "DECLINE",
      "confidence": 0.88,
      "reasoning": "Explicación específica del agente"
    },
    // ... otros 4 agentes
  },
  "risk_breakdown": {
    "PatternDetector": { 
      "score": 85, 
      "contribution": 0.18, 
      "findings_count": 3 
    }
    // ... otros agentes
  },
  "timestamp": "2025-10-23T..."
}
```

### Lógica de Mock Actual

La función `handleAnalyze` determina qué resultado mock usar:
- Si `user_id === 'john_verified'` → Retorna resultado APPROVE
- Cualquier otro user_id → Retorna resultado DECLINE

Esto permite probar ambos escenarios sin backend.

## Componentes Creados

### 1. AgentScoreBar
**Ubicación:** `src/components/features/AgentScoreBar.tsx`

```typescript
interface AgentScoreBarProps {
  name: string;
  analysis: AgentAnalysis;
}
```

Características:
- Barra horizontal con fill animado
- Color dinámico según score
- Muestra nombre, score y recomendación
- Transición suave (1000ms)

### 2. AgentAnalysisCard
**Ubicación:** `src/components/features/AgentAnalysisCard.tsx`

```typescript
interface AgentAnalysisCardProps {
  name: string;
  analysis: AgentAnalysis;
}
```

Características:
- Icono emoji único por agente
- Badge de recomendación
- Risk Score y Confidence destacados
- Análisis en texto
- Lista de findings con bullets
- Hover effect con sombra

## Tipos TypeScript

**Ubicación:** `src/types/index.ts`

```typescript
export interface AgentAnalysis {
  name: string;
  risk_score: number; // 0-100
  findings: string[];
  recommendation: "APPROVE" | "DECLINE";
  confidence: number; // 0.0-1.0
  reasoning: string;
}

export interface FraudAnalysisResult {
  transaction: Transaction;
  decision: "APPROVE" | "DECLINE";
  confidence: number;
  risk_score: number;
  reasoning: string;
  analyzer_results: {
    PatternDetector: AgentAnalysis;
    BehavioralAnalyzer: AgentAnalysis;
    VelocityChecker: AgentAnalysis;
    MerchantRiskAnalyzer: AgentAnalysis;
    GeographicAnalyzer: AgentAnalysis;
  };
  risk_breakdown: { ... };
  timestamp: string;
}

export interface Transaction {
  user_id: string;
  user_age_days: number;
  total_transactions: number;
  amount: number;
  time: string;
  merchant: string;
  merchant_rating: number;
  merchant_fraud_reports: number;
  location: string;
  previous_location?: string;
}
```

## Estilos y UX

### Paleta de Colores
- **APPROVE**: Verde (#10b981)
- **DECLINE**: Rojo (#ef4444)
- **Info**: Azul (#3b82f6)
- **Warning**: Naranja (#f59e0b)
- **Neutral**: Gris (#6b7280)

### Animaciones
- Loading spinner en botón de análisis
- Transición de barras de score (1000ms ease-out)
- Hover effects en tarjetas
- Border transitions en modo selector

### Responsividad
- Grid 2 columnas en desktop (md breakpoint)
- 1 columna en móvil
- Formulario adaptativo
- Tarjetas de agentes apiladas en móvil

## Estados de la Interfaz

1. **Initial**: Formulario vacío, sin resultados
2. **Loading**: Spinner girando, botón deshabilitado
3. **Error**: Mensaje de error en rojo si faltan campos requeridos
4. **Success**: Resultados completos desplegados con animaciones

## Próximos Pasos (Integración Real)

### Para conectar con API real:

1. Actualizar `src/lib/api.ts`:
```typescript
export const analyzeTransaction = async (
  transaction: Transaction,
  mode: 'vanilla' | 'offline_ace' | 'online_ace'
): Promise<FraudAnalysisResult> => {
  const response = await api.post('/api/v1/analyze', {
    transaction,
    mode,
  });
  return response.data;
};
```

2. Reemplazar en `page.tsx`:
```typescript
// Reemplazar esto:
setTimeout(() => { ... }, 1500);

// Con esto:
try {
  const result = await analyzeTransaction(
    transaction as Transaction, 
    mode
  );
  setResult(result);
} catch (err: any) {
  setError(err.message || 'Analysis failed');
} finally {
  setLoading(false);
}
```

3. Configurar variable de entorno:
```bash
VITE_API_BASE_URL=http://localhost:8000
```

## Testing

### Casos de Prueba

1. **Validación de Campos**
   - Intentar analizar sin User ID → Error
   - Intentar analizar sin Amount → Error

2. **Ejemplo 1 (Fraudulento)**
   - Cargar ejemplo 1
   - Ejecutar análisis
   - Verificar: DECLINE, risk_score alto, todos los agentes DECLINE

3. **Ejemplo 2 (Legítimo)**
   - Cargar ejemplo 2
   - Ejecutar análisis
   - Verificar: APPROVE, risk_score bajo, todos los agentes APPROVE

4. **Transacción Personalizada**
   - Ingresar datos manualmente
   - Verificar que usa mock DECLINE por defecto

## Archivos Relacionados

```
src/
├── app/(routes)/live-test/
│   └── page.tsx                      # Página principal ✅
├── components/features/
│   ├── AgentAnalysisCard.tsx         # Tarjeta de agente ✅
│   └── AgentScoreBar.tsx             # Barra de score ✅
├── types/
│   └── index.ts                      # Tipos TypeScript ✅
├── data/
│   └── mockData.json                 # Datos mock JSON ✅
└── lib/
    └── api.ts                        # Cliente API (pendiente)
```

## Notas de Desarrollo

- ✅ Interfaz completamente funcional
- ✅ Mock data en formato JSON
- ✅ Dos ejemplos (APPROVE y DECLINE)
- ✅ Componentes reutilizables
- ✅ TypeScript types definidos
- ✅ Responsive design
- ✅ Animaciones y efectos visuales
- ⏳ Integración con API real (pendiente)
- ⏳ Implementación lógica de modos ACE (pendiente)

---

**Última actualización:** 23 de Octubre, 2025
**Desarrollado por:** Oliver (Frontend Lead)

