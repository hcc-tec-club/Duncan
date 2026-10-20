# Electrical

KiCad projects, one folder per SCH number:

```
electrical/SCH-0001-head-controller/
  SCH-0001-head-controller.kicad_pro
  SCH-0001-head-controller.kicad_sch
  SCH-0001-head-controller.kicad_pcb   (if it's a board)
electrical/libraries/                  shared symbols and footprints
```

- Get the SCH number in the Project Portal first.
- Use parts from `libraries/` or the standard KiCad libraries so others
  can open your project. Add new symbols/footprints to `libraries/`.
- Every part needs a value and a vendor part number in its fields.
- To release: File > Plot (schematic) to PDF, zip the project folder, and
  release both in the Portal. Boards also attach the Gerber zip.
- Connectors and pinouts between subsystems belong in an ICD. Change the
  ICD first, then the schematic.

Using Fusion Electronics instead? Keep the design in the Fusion hub named
like the SCH number, and release the PDF plus an exported archive the
same way.
