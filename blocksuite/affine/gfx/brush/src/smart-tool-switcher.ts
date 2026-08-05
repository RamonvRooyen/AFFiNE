import {
  type GfxController,
  GfxExtension,
  type ToolType,
} from '@blocksuite/std/gfx';

import { BrushTool } from './brush-tool';
import { EraserTool } from './eraser-tool';

const PEN_ERASER_BUTTON = 5;

// touch, pen

export class SmartToolSwitcher extends GfxExtension {
  static override key = 'smart-tool-switcher';
  private wasLastTouchedByPen = false;

  constructor(gfx: GfxController) {
    super(gfx);

    this.gfx.tool.addHook('pointerDown', e => {
      if (this.wasLastTouchedByPen && e.raw.pointerType === 'touch') {
        this.gfx.tool.setTool({ toolName: 'pan' } as ToolType);
      }
      this.wasLastTouchedByPen = e.raw.pointerType === 'pen';
      if (e.raw.pointerType !== 'pen') return true;
      const tool: ToolType | null =
        e.button === PEN_ERASER_BUTTON
          ? EraserTool
          : e.button === 0
            ? BrushTool
            : null;

      if (!tool) return true;

      if (this.gfx.tool.currentToolName$.peek() !== tool.toolName) {
        this.gfx.tool.setTool(tool);
      }

      return false;
    });
  }
}
