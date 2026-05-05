# Rick and Morty Episodes - Angular 21

Aplicación para visualizar episodios de Rick and Morty con filtrado por temporadas y búsqueda.

## Instalación

```bash
npm install
npm start
```

La app corre en `http://localhost:4200`

## Características

- Búsqueda por nombre de episodio
- Filtro multi-select por temporadas
- Vista de tarjetas y tabla
- Detalle de episodio con personajes
- Actualización manual de datos
- Colores por temporada

## Stack

- Angular 21 standalone components
- TypeScript 5.9 strict mode
- NgRx Signals para estado
- Angular Material
- Vitest para testing
- RxJS

## Decisiones técnicas

### Cache completo vs paginación

Decidí no usar la paginación de la API porque:
- Solo hay 51 episodios en total
- Con cache el filtrado es instantáneo
- Menos requests al servidor
- Implementación más simple

Cargo todos los episodios con `expand()` de RxJS y los cacheo con `shareReplay(1)`. El filtrado y paginación se hacen en cliente.

### Botón de actualizar

Agregué un botón de refresh para invalidar el cache y recargar los datos desde la API. Mantiene los filtros actuales.

### NgRx Signal Store

Usé Signal Store en lugar de NgRx tradicional por menos boilerplate y mejor integración con signals de Angular.

## Testing

```bash
npm test
```

Tests incluyen:
- Servicio de API (cache, paginación, invalidación)
- Store (carga, refresh, filtros, paginación)
- Componentes principales
