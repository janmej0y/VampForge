import {
  type ResumeBackgroundIntensity,
  type ResumeBackgroundTheme,
  type ResumeData,
  type ResumeTemplate,
} from "./types";

export type RgbColor = [number, number, number];

type BackgroundStrength = {
  wash: number;
  shape: number;
  line: number;
  frame: number;
  band: number;
};

type BackgroundPalette = {
  paper: RgbColor;
  primary: RgbColor;
  secondary: RgbColor;
  line: RgbColor;
};

export function rgbToHex([red, green, blue]: RgbColor) {
  return [red, green, blue]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

export function rgbToCss([red, green, blue]: RgbColor, alpha = 1) {
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function mixRgb(foreground: RgbColor, background: RgbColor, amount: number): RgbColor {
  return [
    Math.round(background[0] + (foreground[0] - background[0]) * amount),
    Math.round(background[1] + (foreground[1] - background[1]) * amount),
    Math.round(background[2] + (foreground[2] - background[2]) * amount),
  ];
}

function getBackgroundStrength(intensity: ResumeBackgroundIntensity): BackgroundStrength {
  if (intensity === "medium") {
    return {
      wash: 0.16,
      shape: 0.24,
      line: 0.26,
      frame: 0.18,
      band: 0.2,
    };
  }

  return {
    wash: 0.1,
    shape: 0.15,
    line: 0.18,
    frame: 0.12,
    band: 0.12,
  };
}

function getBaseThemePalette(theme: ResumeBackgroundTheme) {
  if (theme === "purple") {
    return {
      primary: [124, 58, 237] as RgbColor,
      secondary: [196, 181, 253] as RgbColor,
      line: [167, 139, 250] as RgbColor,
    };
  }

  if (theme === "neutral") {
    return {
      primary: [71, 85, 105] as RgbColor,
      secondary: [203, 213, 225] as RgbColor,
      line: [148, 163, 184] as RgbColor,
    };
  }

  return {
    primary: [37, 99, 235] as RgbColor,
    secondary: [191, 219, 254] as RgbColor,
    line: [96, 165, 250] as RgbColor,
  };
}

export function getResumeBackgroundPalette(
  template: ResumeTemplate,
  theme: ResumeBackgroundTheme
): BackgroundPalette {
  const base = getBaseThemePalette(theme);

  if (template === "professional") {
    return {
      paper: [250, 250, 250],
      primary: base.primary,
      secondary: base.secondary,
      line: base.line,
    };
  }

  return {
    paper: [255, 255, 255],
    primary: base.primary,
    secondary: base.secondary,
    line: base.line,
  };
}

export function getResumeBackgroundStyles(data: ResumeData) {
  const palette = getResumeBackgroundPalette(data.template, data.backgroundTheme);
  const strength = getBackgroundStrength(data.backgroundIntensity);

  return {
    palette,
    strength,
    wash: mixRgb(palette.secondary, palette.paper, strength.wash),
    accent: mixRgb(palette.primary, palette.paper, strength.shape),
    line: mixRgb(palette.line, palette.paper, strength.line),
    frame: mixRgb(palette.primary, palette.paper, strength.frame),
    band: mixRgb(palette.primary, palette.paper, strength.band),
  };
}
