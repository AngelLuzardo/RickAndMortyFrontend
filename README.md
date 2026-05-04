# Rick and Morty Episodes - Angular 21

Aplicación para visualizar episodios de Rick and Morty con filtrado avanzado por temporadas y búsqueda.

## Requisitos

- **Node.js**: 20.x o superior
- **npm**: 10.x o superior
- **Angular**: 21.x

## Instalación y Ejecución

```bash
npm install
npm start
```

La app corre en `http://localhost:4200`

```bash
npm test              # ejecutar tests
npm run build         # build de producción
```

## Características

- Búsqueda por nombre de episodio
- Filtro multi-select por temporadas (S01-S05)
- Vista de tarjetas o tabla (con ordenamiento)
- Detalle de episodio con personajes y ubicaciones
- Badges de color por temporada
- Actualización manual de datos con timestamp

## Stack Técnico

- **Angular 21** con standalone components
- **TypeScript 5.9** en modo strict
- **NgRx Signals** para manejo de estado
- **Angular Material** para UI
- **Vitest** para testing
- **RxJS** para operaciones asíncronas

## Decisiones de Arquitectura

### Cache Completo vs Paginación de la API

**Decidí NO usar la paginación que ofrece la API** por las siguientes razones:

1. **Dataset pequeño:** La API tiene solo 51 episodios en total (3 páginas de 20 items)
2. **Experiencia de usuario:** Con cache completo, el filtrado y búsqueda son instantáneos, sin esperas de red
3. **Menos requests:** Una sola carga inicial vs múltiples requests cada vez que el usuario cambia de página o filtra
4. **Implementación más simple:** No hay que sincronizar estado de filtros con parámetros de URL de la API

Implementé:
- `getAllEpisodes()` con RxJS `expand()` que carga recursivamente todas las páginas
- `shareReplay(1)` para cachear el resultado en memoria
- Filtrado y paginación 100% en el cliente (12 items por página)

### Botón de Actualizar

Agregué un botón de refresh porque con cache completo surge la pregunta: **¿qué pasa si agregan nuevos episodios?**

Implementación:
- `clearEpisodesCache()` invalida el cache en memoria
- `reloadAllEpisodes()` fuerza una nueva carga desde la API
- `lastUpdated` timestamp visible para que el usuario sepa cuándo fue la última actualización
- El botón llama a `refreshEpisodes()` que recarga y mantiene los filtros actuales

### NgRx Signal Store

Usé Signal Store en lugar del patrón tradicional de NgRx porque:
- Menos boilerplate (sin actions/effects/reducers)
- Sintaxis moderna con signals de Angular
- Type-safe por defecto
- Suficiente para esta aplicación

## API

Usa la API pública de [Rick and Morty](https://rickandmortyapi.com/api)

- `GET /episode` - listado paginado (20 por página)
- `GET /character/{ids}` - detalles de personajes

## Testing

Tests unitarios con Vitest para:
- Servicio de API (cache, paginación recursiva, invalidación)
- Store (loadAllEpisodes, refreshEpisodes, filtros, paginación)
- Componentes principales

```bash
npm test
```
