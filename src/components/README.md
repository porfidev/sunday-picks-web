# Atomic Design

Estructura sugerida:

- atoms: componentes basicos sin logica de composicion.
- molecules: composicion de 2+ atoms.
- organisms: secciones completas de UI.
- templates: layout y estructura de pagina.
- pages: vistas finales conectadas a rutas.

Cada carpeta incluye `index.ts` para re-exportar y simplificar imports.
