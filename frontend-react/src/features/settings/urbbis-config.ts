export const URBBIS_CONFIG_KEY = "urbbisConfig";

export type UrbbisConfig = {
  profileName: string;
  temaOscuro: boolean;
  animaciones: boolean;
  notificaciones: boolean;
  zoomInicial: number;
  animDur: number;
};

export const DEFAULT_URBBIS_CONFIG: UrbbisConfig = {
  profileName: "",
  temaOscuro: false,
  animaciones: true,
  notificaciones: false,
  zoomInicial: 13,
  animDur: 0.6,
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function nombreDesdeCorreo(correo: string): string {
  const text = String(correo || "").trim();
  const user = text.split("@")[0] || "";
  if (!user) return "Usuario";
  return user
    .split(/[._-]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function normalizeUrbbisConfig(input: Partial<UrbbisConfig> | null | undefined): UrbbisConfig {
  const raw = input || {};
  return {
    profileName: String(raw.profileName || DEFAULT_URBBIS_CONFIG.profileName).trim(),
    temaOscuro: !!raw.temaOscuro,
    animaciones: raw.animaciones !== false,
    notificaciones: !!raw.notificaciones,
    zoomInicial: clamp(Number(raw.zoomInicial ?? DEFAULT_URBBIS_CONFIG.zoomInicial) || DEFAULT_URBBIS_CONFIG.zoomInicial, 10, 23),
    animDur: clamp(Number(raw.animDur ?? DEFAULT_URBBIS_CONFIG.animDur) || DEFAULT_URBBIS_CONFIG.animDur, 0, 3),
  };
}

export function loadUrbbisConfig(): UrbbisConfig {
  try {
    const raw = localStorage.getItem(URBBIS_CONFIG_KEY);
    if (!raw) return DEFAULT_URBBIS_CONFIG;
    const parsed = JSON.parse(raw) as Partial<UrbbisConfig>;
    return normalizeUrbbisConfig(parsed);
  } catch {
    return DEFAULT_URBBIS_CONFIG;
  }
}

export function saveUrbbisConfig(config: UrbbisConfig): void {
  localStorage.setItem(URBBIS_CONFIG_KEY, JSON.stringify(config));
}

export function applyUrbbisTheme(config: UrbbisConfig): void {
  document.body.classList.toggle("theme-dark", !!config.temaOscuro);
}

export function applyAndSaveUrbbisConfig(config: UrbbisConfig): UrbbisConfig {
  const normalized = normalizeUrbbisConfig(config);
  saveUrbbisConfig(normalized);
  applyUrbbisTheme(normalized);
  return normalized;
}

